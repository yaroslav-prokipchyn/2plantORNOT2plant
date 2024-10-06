import {equals} from '@serenity-js/assertions';
import {By, PageElement, PageElements, Text} from '@serenity-js/web';

export const dialog =PageElement.located(By.css('.ant-modal')).describedAs('dialog');
export const dialogs = PageElements.located(By.css('.ant-modal-content')).describedAs('dialog');
export const dialogTitle = PageElement.located(By.css('.ant-modal-title'));
export const dialogWithTittle = (text: string) =>
    dialogs.where(Text.of(dialogTitle), equals(text)).first()
        .describedAs(`${text} dialog`)