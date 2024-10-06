import {By, PageElement} from '@serenity-js/web';

import {byPlaceholder} from '../utils/elements';

export const orgName = PageElement.located(byPlaceholder('Enter name'));
export const phoneNumber = PageElement.located(byPlaceholder('Enter phone number'));
export const address = PageElement.located(byPlaceholder('Enter address'));
export const adminName = PageElement.located(byPlaceholder('Enter admin First name'));
export const adminLastName = PageElement.located(byPlaceholder('Enter admin Last name'));
export const adminEmail = PageElement.located(byPlaceholder('Enter admin email'));
export const tab = (text: string) => PageElement.located(By.cssContainingText('[role="tab"]', text)).describedAs(`${text} tab`).describedAs(`${text} tab`);
