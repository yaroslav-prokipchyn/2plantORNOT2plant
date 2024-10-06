import {By, PageElement} from '@serenity-js/web';

const byPlaceholder = (placeholder: string) => By.css(`[placeholder="${placeholder}"]`)
export const fieldNameInput = PageElement.located(byPlaceholder('Enter field name')).describedAs('field name input');
export const operationDropdown = PageElement.located(By.cssContainingText('.ant-select-selector', 'Select user')).describedAs('Select user');
export const cropTypeDropdown = PageElement.located(By.cssContainingText('.ant-select-selector', 'Select crop type')).describedAs('Select crop type');
export const dateInput = PageElement.located(byPlaceholder('Select date')).describedAs('Planting date input');
export const categoryInput = (name: string) => PageElement.located(By.id(name)).describedAs(`${name} category`);
export const finishButton = PageElement.located(By.cssContainingText('a', 'Finish')).describedAs('Finish button');
export const drawButton = PageElement.located(By.css('[title="Draw a polygon"]')).describedAs('Draw poligon button');
export const map = PageElement.located(By.css('leaflet-pane leaflet-map-pane'));
export const searchButton = PageElement.located(By.css('[aria-label="search"]')).describedAs('Search button');
export const parametersPanel = PageElement.located(By.css('.map-bottom-menu-wrapper')).describedAs('Parameters panel');
export const irrigationAmountInput = PageElement.located(byPlaceholder('Enter amount')).describedAs('Irrigation Amount input');
export const searchInput = PageElement.located(By.css('[type="search"]')).describedAs('Search input');
export const searchSection = PageElement.located(By.id('map-container-search-wrapper')).describedAs('Search section');