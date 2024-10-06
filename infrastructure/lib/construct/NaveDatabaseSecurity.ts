import { Construct } from "constructs";
import { IEnvironment } from "../environment/IEnvironment";
import { EnvironmentUtils } from "../utils/EnvironmentUtils";
import { IVpc, Peer, Port, SecurityGroup } from "aws-cdk-lib/aws-ec2";

export interface INaveDatabaseSecurityProps {
  environment: IEnvironment,
  vpc: IVpc,
}

export class NaveDatabaseSecurity extends Construct {

  public readonly databaseSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: INaveDatabaseSecurityProps) {
    super(scope, id);

    this.databaseSecurityGroup = new SecurityGroup(this, EnvironmentUtils.createName('database-security-group', props.environment), {
      vpc: props.vpc,
      securityGroupName: EnvironmentUtils.createName('nave-database-security-group', props.environment),
      description: 'Security group for the database',
    });

    this.databaseSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432), 'Allow access from anywhere');
  }
}
