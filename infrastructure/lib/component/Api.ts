import { Construct } from "constructs";
import { IEnvironment } from "../environment/IEnvironment";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IpAddresses, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { EnvironmentUtils } from "../utils/EnvironmentUtils";
import { NaveCluster } from "../construct/NaveCluster";
import { NaveAuroraDatabase } from "../construct/NaveAuroraDatabase";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { NaveDatabaseSecurity } from "../construct/NaveDatabaseSecurity";

export interface IApiProps {
    environment: IEnvironment,
    hostedZone: IHostedZone,
}

export class Api extends Construct {

    public readonly naveCluster: NaveCluster;

    constructor(scope: Construct, id: string, props: IApiProps) {
        super(scope, id);

        const vpc = new ec2.Vpc(this, EnvironmentUtils.createName('vpc', props.environment), {
            maxAzs: 2,
            ipAddresses: IpAddresses.cidr('10.1.0.0/16'),
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'public-subnet',
                    subnetType: SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'private-subnet',
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                },
            ]
        });

        const naveDatabaseSecurity: NaveDatabaseSecurity = new NaveDatabaseSecurity(this, EnvironmentUtils.createName('nave-database-security', props.environment), {
            environment: props.environment,
            vpc: vpc,
        });

        const database = new NaveAuroraDatabase(this, EnvironmentUtils.createName('nave-database', props.environment), {
            environment: props.environment,
            databaseName: 'nave_analytics_database',
            naveDatabaseSecurity: naveDatabaseSecurity,
            vpc: vpc,
        });

        this.naveCluster = new NaveCluster(this, EnvironmentUtils.createName('nave-cluster', props.environment), {
            environment: props.environment,
            vpc: vpc,
            hostedZone: props.hostedZone,
            database: database,
        });

        this.naveCluster.node.addDependency(database);
    }
}
