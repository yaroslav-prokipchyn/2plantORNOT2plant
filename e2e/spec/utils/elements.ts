import {By, PageElement} from '@serenity-js/web';

export const byPlaceholder = (placeholder: string) => By.css(`[placeholder="${placeholder}"]`).describedAs(`input with placeholder ${placeholder}`);

export const button = (text: string) => PageElement.located(By.cssContainingText('button', text)).describedAs(`${text} button`);
export const img = (label: string) =>
    PageElement.located(By.css(`[aria-label="${label}"]`))
        .describedAs(`${label} img`);
export const item = (text:string) => PageElement.located(By.css(`[title="${text}"]`)).describedAs(`item ${text}`);

//checkbox
export const checkbox = PageElement.located(By.css('[type="checkbox"]').describedAs('Checkbox'));
export const checkboxSelectAll = PageElement.located(By.css('[aria-label="Select all"]').describedAs('Select all'));

//dataPicker
export const dataPicker = PageElement.located(By.css('.ant-picker-dropdown')).describedAs('data picker')
export const today = PageElement.located(By.css('.ant-picker-now')).describedAs('Today button');
export const menuItem = (text: string) => PageElement.located(By.cssContainingText('[role="menuitem"]', text)).describedAs(`${text} menu item`);

//tags
export const dayLeft = PageElement.located(By.cssContainingText('.ant-typography', 'Days left:')).describedAs('Days left');
export const tag = (tag: string) => PageElement.located(By.cssContainingText('.ant-tag', `${tag}`)).describedAs(`counter ${tag}`);

//filter input
export const filterInput = (text: string) => PageElement.located(By.cssContainingText('.ant-select-selector', text)).describedAs('Filter input');