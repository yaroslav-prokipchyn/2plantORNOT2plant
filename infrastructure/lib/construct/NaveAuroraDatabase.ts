import {Construct} from "constructs";
import {IEnvironment} from "../environment/IEnvironment";
import {NaveDatabaseSecurity} from "./NaveDatabaseSecurity";
import {EnvironmentUtils} from "../utils/EnvironmentUtils";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {Duration, RemovalPolicy} from "aws-cdk-lib";
import {
    AmazonLinuxImage,
    Instance,
    InstanceClass,
    InstanceSize,
    InstanceType,
    IVpc,
    KeyPair,
    KeyPairFormat,
    KeyPairType,
    Peer,
    Port,
    SubnetType
} from "aws-cdk-lib/aws-ec2";
import {
    AuroraPostgresEngineVersion,
    ClusterInstance,
    Credentials,
    DatabaseCluster,
    DatabaseClusterEngine
} from "aws-cdk-lib/aws-rds";

export interface NaveAuroraDatabaseProps {
    environment: IEnvironment,
    databaseName: string,
    naveDatabaseSecurity: NaveDatabaseSecurity,
    vpc: IVpc,
}
export class NaveAuroraDatabase extends Construct {

    public readonly secrets: ISecret;
    constructor(scope: Construct, id: string, props: NaveAuroraDatabaseProps) {
        super(scope, id);

        const databaseCluster = new DatabaseCluster(this, EnvironmentUtils.createName('aurora-database', props.environment), {
            defaultDatabaseName: props.databaseName,
            engine: DatabaseClusterEngine.auroraPostgres({version: AuroraPostgresEngineVersion.VER_15_5}),
            credentials: Credentials.fromGeneratedSecret('naveadmin'),
            writer: ClusterInstance.provisioned('writer', {instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM)}),
            vpcSubnets: {subnetType: SubnetType.PRIVATE_WITH_EGRESS},
            backup: {retention: Duration.days(7)},
            removalPolicy: RemovalPolicy.SNAPSHOT,
            securityGroups: [props.naveDatabaseSecurity.databaseSecurityGroup],
            vpc: props.vpc,
        });

        if (!databaseCluster.secret) {
            throw new Error('Database secret not found');
        }

        this.secrets = databaseCluster.secret;

        const sshKey = new KeyPair(this, 'SshKey', {
            type: KeyPairType.ED25519,
            format: KeyPairFormat.PEM,
        })

        const bastionHost = new Instance(this, EnvironmentUtils.createName('nave-database-bastion', props.environment), {
            vpc: props.vpc,
            vpcSubnets: { subnetType: SubnetType.PUBLIC},
            instanceName: EnvironmentUtils.createName('nave-database-bastion', props.environment),
            instanceType: new InstanceType('t2.micro'),
            machineImage: new AmazonLinuxImage(),
            keyPair: sshKey,
        });

        bastionHost.connections.allowFrom(Peer.ipv4('0.0.0.0/0'), Port.tcp(22), 'Allow SSH access from anywhere');

        databaseCluster.connections.allowFrom(bastionHost, Port.tcp(5432), 'Allow access from bastion');
    }
}
