import { Construct } from "constructs";
import { IEnvironment } from "../environment/IEnvironment";
import { LoadBalancerV2Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { EnvironmentUtils } from "../utils/EnvironmentUtils";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { Duration } from "aws-cdk-lib";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import {
    AllowedMethods,
    CachePolicy,
    Distribution,
    OriginProtocolPolicy,
    OriginRequestPolicy,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";

export interface INaveCloudfrontProps {
    environment: IEnvironment;
    hostedZone: IHostedZone;
    webAlb: ApplicationLoadBalancedFargateService;
}

export class NaveCloudfront extends Construct {

    public readonly distribution: Distribution;

    constructor(scope: Construct, id: string, props: INaveCloudfrontProps) {
        super(scope, id);

        const certificateArn = props.environment.certificateArn;
        const certificate = Certificate.fromCertificateArn(this, EnvironmentUtils.createName('nave-cloudfront-certificate', props.environment), certificateArn);

        const webAlbOrigin = new LoadBalancerV2Origin(props.webAlb.loadBalancer, {
            protocolPolicy: OriginProtocolPolicy.MATCH_VIEWER,
        });

        this.distribution = new Distribution(this, EnvironmentUtils.createName('nave-cloudfront', props.environment), {
            domainNames: [EnvironmentUtils.getEnvironmentUri(props.environment)],
            certificate: certificate,
            defaultBehavior: {
                origin: webAlbOrigin,
                allowedMethods: AllowedMethods.ALLOW_ALL,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: CachePolicy.CACHING_DISABLED,
                originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
            },
        });

        new ARecord(this, EnvironmentUtils.createName('sub-domain', props.environment), {
            zone: props.hostedZone,
            target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
            recordName: EnvironmentUtils.getEnvironmentUri(props.environment),
            ttl: Duration.minutes(5),
        });
    }

    createApiBehavior(apiService: ApplicationLoadBalancedFargateService) {

        const apiAlbOrigin = new LoadBalancerV2Origin(apiService.loadBalancer, {
            protocolPolicy: OriginProtocolPolicy.MATCH_VIEWER,
        });

        this.distribution.addBehavior('/api/*', apiAlbOrigin, {
            allowedMethods: AllowedMethods.ALLOW_ALL,
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            cachePolicy: CachePolicy.CACHING_DISABLED,
            originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
        });
    }

    createVizBehavior(vizService: ApplicationLoadBalancedFargateService) {

        const vizAlbOrigin = new LoadBalancerV2Origin(vizService.loadBalancer, {
            protocolPolicy: OriginProtocolPolicy.MATCH_VIEWER,
        });

        this.distribution.addBehavior('/data/*', vizAlbOrigin, {
            allowedMethods: AllowedMethods.ALLOW_ALL,
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            cachePolicy: CachePolicy.CACHING_DISABLED,
            originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
        });
    }
}
