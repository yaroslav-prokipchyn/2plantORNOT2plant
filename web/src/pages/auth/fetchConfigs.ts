import { config } from "src/config/config";
import { Amplify } from 'aws-amplify';

export const configureCognito  = async () => {
    const configsJson = await fetch(config.API_URL + '/configs');
    if (!configsJson.ok) {
        throw new Error('Failed to fetch configurations');
    }

    const configs = await configsJson.json();

    const amplifyConfig = {
        aws_user_pools_web_client_id: configs.clientId,
        aws_user_pools_id: configs.userPoolId,
        aws_project_region: configs.region,
    }
    Amplify.configure(amplifyConfig);
};
