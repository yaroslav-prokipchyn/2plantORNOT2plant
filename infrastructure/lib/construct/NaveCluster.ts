import { IEnvironment } from "../environment/IEnvironment";
import { Construct } from "constructs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { NaveRegistry } from "./NaveRegistry";
import { EnvironmentUtils } from "../utils/EnvironmentUtils";
import { DatabaseSecrets } from "./DatabaseSecrets";
import { Cluster, Secret } from "aws-cdk-lib/aws-ecs";
import { NaveAuroraDatabase } from "./NaveAuroraDatabase";
import { ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { IVpc, SubnetType } from "aws-cdk-lib/aws-ec2";
import { NaveCognito } from "../component/NaveCognito";
import { PolicyDocument, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";

export interface INaveClusterProps {
    environment: IEnvironment,
    vpc: IVpc,
    hostedZone: IHostedZone,
    database: NaveAuroraDatabase,
}

export class NaveCluster extends Construct {

    private readonly props: INaveClusterProps;
    private readonly cluster: Cluster;
    private readonly registry: NaveRegistry;
    private readonly certificate: Certificate;
    private readonly dbUrl: string;

    constructor(scope: Construct, id: string, props: INaveClusterProps) {
        super(scope, id);

        this.props = props;

        this.registry = new NaveRegistry(this, 'nave-registry', {
            environment: props.environment,
        });

        this.cluster = new Cluster(this, EnvironmentUtils.createName('nave-cluster', props.environment), {
            clusterName: EnvironmentUtils.createName('nave-cluster', props.environment),
            vpc: props.vpc,
        });

        this.certificate = new Certificate(this, EnvironmentUtils.createName('nave-alb-certificate', props.environment), {
            ...EnvironmentUtils.getCertificateDomainSettings(props.environment),
            validation: CertificateValidation.fromDns(props.hostedZone),
        });

        this.dbUrl = `jdbc:postgresql://${props.database.secrets.secretValueFromJson(DatabaseSecrets.HOST).unsafeUnwrap()}:${props.database.secrets.secretValueFromJson(DatabaseSecrets.PORT).unsafeUnwrap()}/${props.database.secrets.secretValueFromJson(DatabaseSecrets.DB_NAME).unsafeUnwrap()}`;
    }

    createWebService() {
        const webService = new ApplicationLoadBalancedFargateService(this, EnvironmentUtils.createName('nave-web-service', this.props.environment), {
            cluster: this.cluster,
            memoryLimitMiB: this.props.environment.webMemoryLimitMiB,
            cpu: this.props.environment.webCpu,
            publicLoadBalancer: true,
            taskSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            assignPublicIp: true,
            // circuitBreaker: { rollback: true },
            taskImageOptions: {
                image: this.registry.webImage,
                containerPort: 3000,
            },
            protocol: ApplicationProtocol.HTTPS,
            redirectHTTP: true,
            certificate: this.certificate,
            domainZone: this.props.hostedZone,
        });

        webService.targetGroup.configureHealthCheck({
            path: "/",
        });

        return webService;
    }

    createApiService(cognito: NaveCognito) {
        const apiService = new ApplicationLoadBalancedFargateService(this, EnvironmentUtils.createName('nave-api-service', this.props.environment), {
            cluster: this.cluster,
            memoryLimitMiB: this.props.environment.apiMemoryLimitMiB,
            cpu: this.props.environment.apiCpu,
            publicLoadBalancer: true,
            taskSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            assignPublicIp: true,
            // circuitBreaker: { rollback: true },
            taskImageOptions: {
                image: this.registry.apiImage,
                containerPort: 8080,
                secrets: {
                    'NAVE_DB_USERNAME': Secret.fromSecretsManager(this.props.database.secrets, DatabaseSecrets.USERNAME),
                    'NAVE_DB_PASSWORD': Secret.fromSecretsManager(this.props.database.secrets, DatabaseSecrets.PASSWORD),
                },
                environment: {
                    'NAVE_DB_URL': this.dbUrl,
                    'NAVE_ISSUER_URI': cognito.swaggerIssuerUri,
                    'NAVE_OAUTH_CLIENT_ID': cognito.oauthClientId,
                    'NAVE_URL': `https://${EnvironmentUtils.getEnvironmentUri(this.props.environment)}`,
                    'NAVE_AUTHORIZATION_URL': cognito.authAuthorizationUri,
                    'NAVE_TOKEN_URL': cognito.authTokenUri,
                    'NAVE_COGNITO_USER_POOL_ID': cognito.userPool.userPoolId,
                    'NAVE_CLIENT_ID': cognito.appClientId,
                    'NAVE_REGION': this.props.environment.region,
                    'NAVE_ENVIRONMENT': this.props.environment.environmentName,
                    'ACCOUNT_ID': this.props.environment.accountId,
                    ...this.props.environment.apiEnvs,
                }
            },
            protocol: ApplicationProtocol.HTTPS,
            redirectHTTP: true,
            certificate: this.certificate,
            domainZone: this.props.hostedZone,
        });

        apiService.taskDefinition.addToTaskRolePolicy(new PolicyStatement({
            actions: ['cognito-idp:*'],
            resources: [cognito.userPool.userPoolArn],
        }));
        apiService.taskDefinition.addToTaskRolePolicy(new PolicyStatement({
            actions: ['iam:*'],
            resources: [
              `arn:aws:iam::${this.props.environment.accountId}:role/nave_s3_access_for_*`,
              `arn:aws:iam::${this.props.environment.accountId}:policy/ClientAppPolicy-*`,
            ]
        }));

        apiService.taskDefinition.addToTaskRolePolicy(new PolicyStatement({
            actions: ['s3:*'],
            resources: [`arn:aws:s3:::*`],
        }));


        apiService.targetGroup.configureHealthCheck({
            path: "/api/actuator/health",
            interval: Duration.seconds(300),
            healthyHttpCodes: "200",
            healthyThresholdCount: 2,
            unhealthyThresholdCount: 10
        });

        return apiService;
    }

    createVizPythonService(cognito: NaveCognito) {
        const taskRole = new Role(this, 'vizPythonRole', {
            assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
            roleName: EnvironmentUtils.createName('nave-viz-python-task-role', this.props.environment),
            inlinePolicies: {
                's3-access': new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: ['s3:*'],
                            resources: ['*'],
                        }),
                    ]
                }),
                'assume-role': new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: ['sts:AssumeRole'],
                            resources: [`arn:aws:iam::${this.props.environment.accountId}:role/nave_s3_access_for_*`]
                        }),
                    ]
                }),
            }
        });
        const vizPythonService = new ApplicationLoadBalancedFargateService(this, EnvironmentUtils.createName('nave-viz-python-service', this.props.environment), {
            cluster: this.cluster,
            memoryLimitMiB: this.props.environment.vizMemoryLimitMiB,
            cpu: this.props.environment.vizCpu,
            publicLoadBalancer: true,
            taskSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            assignPublicIp: true,
            // circuitBreaker: { rollback: true },
            taskImageOptions: {
                taskRole: taskRole,
                image: this.registry.vizImage,
                containerPort: 8000,
                environment: {
                    'NAVE_ISSUER_URI': cognito.swaggerIssuerUri,
                    'NAVE_COGNITO_USER_POOL_ID': cognito.userPool.userPoolId,
                    'NAVE_CLIENT_ID': cognito.appClientId,
                    'NAVE_REGION': this.props.environment.region,
                    'ACCOUNT_ID': this.props.environment.accountId,
                    ...this.props.environment.vizEnvs,
                }
            },
            protocol: ApplicationProtocol.HTTPS,
            redirectHTTP: true,
            certificate: this.certificate,
            domainZone: this.props.hostedZone,
        });

        vizPythonService.targetGroup.configureHealthCheck({
            path: "/data",
        });

        return vizPythonService;
    }
}
