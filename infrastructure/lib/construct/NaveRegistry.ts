import { Construct } from "constructs";
import { IEnvironment } from "../environment/IEnvironment";
import { SecretValue } from "aws-cdk-lib";
import { EnvironmentUtils } from "../utils/EnvironmentUtils";
import { ContainerImage, RepositoryImage } from "aws-cdk-lib/aws-ecs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

export interface INaveRegistryProps {
    environment: IEnvironment,
}

export class NaveRegistry extends Construct {

    public readonly apiImage: RepositoryImage;
    public readonly webImage: RepositoryImage;
    public readonly vizImage: RepositoryImage;

    constructor(scope: Construct, id: string, props: INaveRegistryProps) {
        super(scope, id);

        const apiImageUrl = 'ghcr.io/naveanalytics-vitech/nave-app-api';
        const apiTag = process.env.VERSION_API;

        const webImageUrl = 'ghcr.io/naveanalytics-vitech/nave-app-web';
        const webTag = process.env.VERSION_WEB;
        
        const vizImageUrl = 'ghcr.io/naveanalytics-vitech/nave-app-viz-backend';
        const vizTag = process.env.VERSION_VIZ;

        const githubRegistryToken = process.env.GITHUB_REGISTRY_TOKEN;

        if (!githubRegistryToken || !apiTag || !webTag || !vizTag) {
            throw new Error('GitHub registry user, token, and image tags are required');
        }

        const githubApiSecrets = new Secret(this, EnvironmentUtils.createName('GitHubApiTokenSecret', props.environment), {
            secretName: EnvironmentUtils.createName('GitHubApiTokenSecret', props.environment),
            secretObjectValue: {
                username: SecretValue.unsafePlainText('username_does_not_matter'),
                password: SecretValue.unsafePlainText(githubRegistryToken),
            }
        });

        this.apiImage = ContainerImage.fromRegistry(`${apiImageUrl}:${apiTag}`, {
            credentials: githubApiSecrets,
        });

        this.webImage = ContainerImage.fromRegistry(`${webImageUrl}:${webTag}`, {
            credentials: githubApiSecrets,
        });
        
        this.vizImage = ContainerImage.fromRegistry(`${vizImageUrl}:${vizTag}`, {
            credentials: githubApiSecrets,
        });
    }
}
