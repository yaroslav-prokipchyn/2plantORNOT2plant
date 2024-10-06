import { Construct } from "constructs";
import { IEnvironment } from "../environment/IEnvironment";
import { CfnUserPoolUser, OAuthScope, UserPool, UserPoolEmail, VerificationEmailStyle } from "aws-cdk-lib/aws-cognito";
import { EnvironmentUtils } from "../utils/EnvironmentUtils";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { UserPoolDomainTarget } from "aws-cdk-lib/aws-route53-targets";
import { Duration } from "aws-cdk-lib";

export interface INaveCognitoProps {
  environment: IEnvironment;
  hostedZone: IHostedZone;
}

export class NaveCognito extends Construct {

  public readonly userPool: UserPool;
  public readonly swaggerIssuerUri: string;
  public readonly oauthClientId: string;
  public readonly authAuthorizationUri: string;
  public readonly authTokenUri: string;
  public readonly appClientId: string;

  constructor(scope: Construct, id: string, props: INaveCognitoProps) {
    super(scope, id);

    const emailOptions = props.environment.sesEmail
      ? UserPoolEmail.withSES({
        sesRegion: props.environment.region,
        fromEmail: props.environment.sesEmail
      })
      : UserPoolEmail.withCognito();

    this.userPool = new UserPool(this, 'nave-user-pool', {
      userPoolName: EnvironmentUtils.createName('user-pool', props.environment),
      autoVerify: {email: true},
      signInAliases: {email: true},
      selfSignUpEnabled: false,
      email: emailOptions,
      standardAttributes: {
        givenName: {required: true, mutable: true},
        familyName: {required: true, mutable: true},
        email: {required: true, mutable: true},
      },
      userVerification: {
        emailSubject: 'Verify your email for nave app!',
        emailBody: props.environment.verificationEmailTemplatePath(),
        emailStyle: VerificationEmailStyle.CODE
      },
      userInvitation: {
        emailSubject: 'Invite to join nave app!',
        emailBody: props.environment.invitationEmailTemplatePath()
          .replace(/\$\{url\}/g, `https://${EnvironmentUtils.getEnvironmentUri(props.environment)}`)
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireDigits: false,
        requireSymbols: false,
        requireUppercase: false,
        tempPasswordValidity: Duration.days(30),
      },
    });

    const certificateArn = props.environment.certificateArn;
    const certificate = Certificate.fromCertificateArn(this, EnvironmentUtils.createName('nave-cloudfront-certificate', props.environment), certificateArn);

    const userPoolDomainName = EnvironmentUtils.getUserPoolDomainName(props.environment);

    const userPoolDomain = this.userPool.addDomain(EnvironmentUtils.createName('auth-cognito-domain', props.environment), {
      customDomain: {
        domainName: userPoolDomainName,
        certificate: certificate,
      },
    });

    const userPoolDomainRecord = new ARecord(this, EnvironmentUtils.createName('auth-cognito-domain-a-record', props.environment), {
      zone: props.hostedZone,
      target: RecordTarget.fromAlias(new UserPoolDomainTarget(userPoolDomain)),
      recordName: userPoolDomainName,
      ttl: Duration.minutes(5),
    });

    const resourceServer = this.userPool.addResourceServer(EnvironmentUtils.createName('auth0-resource-server', props.environment), {
      identifier: EnvironmentUtils.createName('nave-app-identifier', props.environment),
      userPoolResourceServerName: "nave-app",
      scopes: [
        {
          scopeName: "json_export",
          scopeDescription: "json export of fields ans irrigation",
        },
        {
          scopeName: "api_org_access",
          scopeDescription: "access to organization data for api user",
        },
      ],
    });

    for (let email of props.environment.defaultUserEmails) {
      new CfnUserPoolUser(this, EnvironmentUtils.createName(email, props.environment), {
        userPoolId: this.userPool.userPoolId,
        desiredDeliveryMediums: ['EMAIL'],
        forceAliasCreation: true,
        username: email,
        userAttributes: [
          {
            name: 'email',
            value: email,
          },
          {
            name: 'email_verified',
            value: 'true',
          },
        ],
      });
    }

    const appClient = this.userPool.addClient(EnvironmentUtils.createName('app-client', props.environment), {
      generateSecret: false,
      userPoolClientName: EnvironmentUtils.createName('app-client', props.environment),
      authFlows: {
        userSrp: true,
      }
    });

    const clientCredentials = this.userPool.addClient(EnvironmentUtils.createName('client-credentials', props.environment), {
      generateSecret: true,
      userPoolClientName: EnvironmentUtils.createName('calculation-engine-client', props.environment),
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        scopes: [OAuthScope.custom(props.environment.environmentName+"-nave-app-identifier/json_export")],
      },
    });
    clientCredentials.node.addDependency(resourceServer);

    const swaggerClient = this.userPool.addClient(EnvironmentUtils.createName('swagger-client', props.environment), {
      generateSecret: true,
      userPoolClientName: EnvironmentUtils.createName('swagger-client', props.environment),
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
      },
      oAuth: {
        callbackUrls: [
          'http://localhost:8080/api/swagger-ui/oauth2-redirect.html',
          `https://${EnvironmentUtils.getEnvironmentUri(props.environment)}/api/swagger-ui/oauth2-redirect.html`,
        ],
        logoutUrls: [
          `https://${EnvironmentUtils.getEnvironmentUri(props.environment)}/logout`,
          'http://localhost:8080/api/logout',
        ],
        scopes: [OAuthScope.custom("openid")],
      },
    });

    this.swaggerIssuerUri = `https://cognito-idp.${props.environment.region}.amazonaws.com/${this.userPool.userPoolId}`;
    this.oauthClientId = swaggerClient.userPoolClientId;
    this.authAuthorizationUri = `https://${userPoolDomainName}/oauth2/authorize`;
    this.authTokenUri = `https://${userPoolDomainName}/oauth2/token`;
    this.appClientId = appClient.userPoolClientId;
  }
}
