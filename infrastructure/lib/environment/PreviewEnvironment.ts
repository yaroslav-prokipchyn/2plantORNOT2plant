import { IEnvironment } from "./IEnvironment";
import { template as invitationTemplate } from "../emailTemplates/previewUserInvitationEmailTemplate.html";
import { template as verificationTemplate } from "../emailTemplates/previewUserVerification.html";

export class PreviewEnvironment implements IEnvironment {
    environmentName = 'preview';
    accountId = '804050381141'
    region = 'us-west-2';
    templateName = 'preview';
    domainName = 'nave-app.com';
    subDomain = undefined;
    hostedZoneId = 'Z03389573C7FZYC08JM0L';
    certificateArn = 'arn:aws:acm:us-east-1:804050381141:certificate/0d5172ce-bbb4-4748-84dd-ac943914903c';
    apiMemoryLimitMiB = 1024;
    apiCpu = 256;
    webMemoryLimitMiB = 512;
    webCpu = 256;
    vizMemoryLimitMiB = 512;
    vizCpu = 256;
    vizEnvs = {};
    apiEnvs = {
        SPRING_PROFILES_ACTIVE: 'dev',
    }
    defaultUserEmails = [
        'val@naveanalytics.com',
        'anton.nazaruk@vitechteam.com',
        'bohdan.sava@vitechteam.com',
        'yaroslav.prokipchyn@gmail.com',
        'oksana.mardak@vitechteam.com',
        'oleksandra.makhova@vitechteam.com',
        'sofiia.zahoruiko@vitechteam.com',
        'taras.seman@vitechteam.com',
        'viktor.vakhramieiev@vitechteam.com',
        'yaroslav.prokipchyn@vitechteam.com'
    ]
    sesEmail = undefined;
    invitationEmailTemplatePath = () => invitationTemplate;
    verificationEmailTemplatePath = () => verificationTemplate;
}
