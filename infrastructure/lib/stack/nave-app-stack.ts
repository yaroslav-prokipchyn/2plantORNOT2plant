import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Api } from "../component/Api";
import { EnvironmentUtils } from "../utils/EnvironmentUtils";
import { IEnvironment } from "../environment/IEnvironment";
import { NaveCloudfront } from "../component/NaveCloudfront";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { NaveCognito } from "../component/NaveCognito";
import {EnvironmentFactory} from "../environment/EnvironmentFactory";
import {Tags} from "aws-cdk-lib";

export class NaveAppStack extends cdk.Stack {
  constructor(
      scope: Construct,
  ) {

    if (!process.env.TEMPLATE_NAME) {
      throw new Error('TEMPLATE_NAME is required');
    }

    const environment: IEnvironment = process.env.ENVIRONMENT_NAME ? EnvironmentFactory.create(process.env.TEMPLATE_NAME, process.env.ENVIRONMENT_NAME)
        : EnvironmentFactory.create(process.env.TEMPLATE_NAME);

    const id = EnvironmentUtils.createName('stack', environment);

    const props: cdk.StackProps = {
        env: {
            account: environment.accountId,
            region: environment.region
        }
    }

    Tags.of(scope).add('environmentName', environment.environmentName);

    super(scope, id, props);

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, EnvironmentUtils.createName('nave-hosted-zone', environment), {
      hostedZoneId: environment.hostedZoneId,
      zoneName: environment.domainName,
    });

    const api = new Api(this, EnvironmentUtils.createName('Analytics', environment), {
      environment: environment,
      hostedZone: hostedZone,
    });

    const naveCloudfront = new NaveCloudfront(this, EnvironmentUtils.createName('nave-cloudfront', environment), {
      environment: environment,
      hostedZone: hostedZone,
      webAlb: api.naveCluster.createWebService(),
    });

    const cognito = new NaveCognito(this, EnvironmentUtils.createName('nave-cognito', environment), {
        environment: environment,
        hostedZone: hostedZone,
    });

    cognito.node.addDependency(naveCloudfront);

    naveCloudfront.createApiBehavior(api.naveCluster.createApiService(cognito));
    naveCloudfront.createVizBehavior(api.naveCluster.createVizPythonService(cognito));
  }
}
