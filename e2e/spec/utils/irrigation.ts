import {Ensure, isPresent} from '@serenity-js/assertions';
import {Task} from '@serenity-js/core';
import {By, Click, Enter, PageElement} from '@serenity-js/web';

import {dateInput, irrigationAmountInput} from '../map-view/elements';
import {dialogWithTittle} from './dialog';
import {button, dataPicker, today} from './elements';
import {EnsurePopupWithMessage} from './popup';
import {rowWithTextInCell} from './table';
import moment = require('moment/moment');

const irrigationTable = PageElement.located(By.id('irrigation-table').describedAs('Irrigation table'));
const todayDate = moment().format('MMMM DD, YYYY');

export const AddIrrigationFromParametersPanel = (amount: number) =>
    Task.where('User add irrigation',
        Click.on(button('Add irrigation')),
        Enter.theValue(amount).into(irrigationAmountInput),
        Click.on(dateInput.of(dialogWithTittle('Add irrigation'))),
        Click.on(today.of(dataPicker)),
        Click.on((button('Add')).of(dialogWithTittle('Add irrigation'))),
        EnsurePopupWithMessage(`The new irrigation was successfully added.`),
        Ensure.that(rowWithTextInCell(todayDate, 1).of(irrigationTable), isPresent()),
    );