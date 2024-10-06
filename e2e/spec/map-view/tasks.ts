import {faker, fakerEN} from '@faker-js/faker';
import {Ensure, isPresent} from '@serenity-js/assertions';
import {Answerable, d, Duration, Interaction, LogicError, Task, Wait} from '@serenity-js/core';
import {PlaywrightPage} from '@serenity-js/playwright';
import {By, Click, Enter, PageElement} from '@serenity-js/web';

import {dialog, dialogWithTittle} from '../utils/dialog';
import {SelectItemInDropdown} from '../utils/dropdownSelect';
import {button, dataPicker, item, today} from '../utils/elements';
import {EnsurePopupWithMessage} from '../utils/popup';
import {
    categoryInput,
    cropTypeDropdown,
    dateInput,
    drawButton,
    fieldNameInput,
    finishButton,
    operationDropdown
} from './elements';

export const ClickOnPosition = (pageElement: Answerable<PageElement>, x: number, y: number) =>
    Interaction.where(d`Actor clicks on the coordinate x=${x},y=${y}.`, async (actor) => {
        const element = await actor.answer(pageElement)
        const locator = element.locator.selector.value.toString();
        if (locator.length < 0) {
            throw new LogicError(d`Locator is empty ${element}`);
        }
        await PlaywrightPage.current().nativePage().locator(locator).click({position: {x: x, y: y}}).answeredBy(actor)
        await Wait.for(Duration.ofMilliseconds(100)).performAs(actor)
    });

const numberX = fakerEN.number.int({min: 200, max: 400});
const numberY = numberX + 30;

export function DrawField() {
    return Task.where('Actor draw the poligon',
        Click.on(drawButton),
        ClickOnPosition(PageElement.located(By.css('#root')), numberX, numberY),
        ClickOnPosition(PageElement.located(By.css('#root')), numberY, numberY),
        ClickOnPosition(PageElement.located(By.css('#root')), numberY, numberX),
        Click.on(finishButton)
    )
}

export const SelectCategory = (itemName: string, category: string) =>
    Task.where(`Actor select the ${itemName} in the ${category}`,
        Click.on(categoryInput(category)),
        Click.on(item(itemName))
    );

export function CreateField(userName: string) {
    return Task.where('Actor fill the field dialog and create a field',
        Ensure.that(dialog, isPresent()),
        Enter.theValue(fieldName).into(fieldNameInput),
        SelectItemInDropdown(userName, operationDropdown),
        SelectItemInDropdown(cropItem, cropTypeDropdown),
        Click.on(dateInput),
        Click.on(today.of(dataPicker)),
        Click.on((button('Next'))),
        SelectCategory(soilItem, 'Soil Type'),
        SelectCategory(climateItem, 'Climate Type'),
        SelectCategory(regionItem, 'Region'),
        Click.on((button('Create')).of(dialog)),
        EnsurePopupWithMessage(`The new field ${fieldName} was successfully created.`),
    )
}

export function UploadFields(filePaths: string[]) {
    return Task.where('Actor upload the files and create fields',
        Click.on(button('Upload fields')),
        UploadFiles(filePaths),
        Click.on(button('Upload').of(dialogWithTittle('Upload Fields'))),
        EnsurePopupWithMessage('The new fields were successfully created.'),
    )
}

export const filePath1 = '../e2e/spec/testData/safrinha_2024_with_columns_selected.cpg';
export const filePath2 = '../e2e/spec/testData/safrinha_2024_with_columns_selected.dbf';
export const filePath3 = '../e2e/spec/testData/safrinha_2024_with_columns_selected.prj';
export const filePath4 = '../e2e/spec/testData/safrinha_2024_with_columns_selected.shp';
export const filePath5 = '../e2e/spec/testData/safrinha_2024_with_columns_selected.shx';

export const UploadFiles = (filePaths: string[]) =>
    Interaction.where(`Actor uploads a files`, async (actor) => {
        const fileInputLocator = PlaywrightPage.current().nativePage().locator('.ant-upload input[type="file"]').describedAs('upload input');
        await fileInputLocator.setInputFiles(filePaths).answeredBy(actor);
    });

export const fieldName = fakerEN.animal.bird();
export const regionItem =  faker.helpers.arrayElement(['North', 'East', 'South', 'West']);
export const climateItem =  faker.helpers.arrayElement(['Tropical Climates', 'Dry Climates', 'Temperate Climates', 'Continental Climates', 'Polar Climates', 'Highland Climates']);
export const soilItem =  faker.helpers.arrayElement(['Loam Soil', 'Sandy Soil', 'Clay Soil', 'Peat Soil', 'Chalky Soil', 'Silty Clay Soil', 'Sandy Loam Soil']);
export const cropItem =  faker.helpers.arrayElement(['Corn', 'Beets', 'Cotton', 'Cereal', 'Potatoes', 'Soybean']);

