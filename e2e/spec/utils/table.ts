import {equals} from '@serenity-js/assertions';
import {MetaQuestionAdapter} from '@serenity-js/core';
import {By, PageElement, PageElements, Text} from '@serenity-js/web';

export const rows = PageElements.located(By.css('.ant-table-row')).describedAs('rows');

export  const columnWithNumber = (number: number) => PageElement.located(By.css(`.table-column:nth-child(${number})`)).describedAs(`column with ${number}`);
const cellWithNumber = (number:number) => PageElement.located(By.css(`td:nth-child(${number})`)).describedAs(`cell with number ${number}`);
export const fieldNameInTable = PageElement.located(By.css('.ant-space-item:nth-child(2)')).describedAs('field name in table');

export const rowWithTextInCell = (text: string, cellNumber:number) => rowWithTextIn(text, cellWithNumber(cellNumber));
export const rowWithFieldName = (text: string) => rowWithTextIn(text, fieldNameInTable);

const rowWithTextIn = (text: string, p: MetaQuestionAdapter<PageElement, PageElement>) =>
    rows.where(Text.of(p), equals(text)).first()
        .describedAs(`row with ${text}`);