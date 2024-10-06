import {Ensure, isPresent} from '@serenity-js/assertions';
import {Task, Wait} from '@serenity-js/core';
import {Click, Enter} from '@serenity-js/web';

import {item} from '../utils/elements';
import {parametersPanel, searchButton, searchInput, searchSection} from './elements';

export const SearchField = (fieldName: string) =>
    Task.where(`Actor search the ${fieldName} field`,
        Wait.until(searchButton, isPresent()),
        Click.on(searchButton),
        Click.on(searchInput.of(searchSection)),
        Enter.theValue(fieldName).into(searchInput.of(searchSection)),
    );

export const SelectItemFromSearch = (fieldName: string) =>
    Task.where(`Actor select the ${fieldName} from search`,
        Ensure.eventually(item(fieldName), isPresent()),
        Click.on(item(fieldName)),
        Wait.until(parametersPanel, isPresent()),
    );