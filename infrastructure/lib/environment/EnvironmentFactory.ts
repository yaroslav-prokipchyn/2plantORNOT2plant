import { IEnvironment } from "./IEnvironment";
import { DevEnvironment } from "./DevEnvironment";
import { ProdEnvironment } from "./ProdEnvironment";
import { PreviewEnvironment } from "./PreviewEnvironment";

export class EnvironmentFactory {
    private static environmentMap: { [key: string]: IEnvironment } = {
        dev: new DevEnvironment(),
        prod: new ProdEnvironment(),
        preview: new PreviewEnvironment(),
    };

    static create(templateName: string, environmentName?: string): IEnvironment {
        const environment = this.environmentMap[templateName];
        if (environment) {
            environment.environmentName = environmentName ? environmentName : environment.environmentName;
            return environment;
        } else {
            throw new Error(`Unknown environment slug: ${templateName}`);
        }
    }
}
