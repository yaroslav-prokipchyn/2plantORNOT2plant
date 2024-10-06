import {Ensure, equals, isPresent, not} from '@serenity-js/assertions';
import {Task} from '@serenity-js/core';
import {LastResponse} from '@serenity-js/rest';
import {By, Click, PageElement, Text} from '@serenity-js/web';

import {
    DeleteAllUrgFields,
    DeleteUserWithEmail,
    ExportFieldsByApi,
    LoginByApi,
    UnlockOrganization
} from '../apiCalls';
import {parametersPanel} from '../map-view/elements';
import {dialog} from '../utils/dialog';
import {
    button,
    checkbox, img,
} from '../utils/elements';
import {errorNotification} from '../utils/popup';
import {columnWithNumber, fieldNameInTable, rowWithFieldName, rowWithTextInCell} from '../utils/table';

export const CleanData = (orgId: string, email: string, role: string) =>
    Task.where('Clean data',
        LoginByApi,
        UnlockOrganization(orgId),
        DeleteAllUrgFields(orgId),
        DeleteUserWithEmail(email, role),
    );

export const CompereTwoFields = (field1: string, field2: string) =>
    Task.where('User is able to compare two fields',
        Click.on(checkbox.of(rowWithFieldName(field1))),
        Click.on(checkbox.of(rowWithFieldName(field2))),
        Click.on(button('Compare Fields')),
        Ensure.that(Text.of(fieldNameInTable.of(columnWithNumber(2))), equals(field1)),
        Ensure.that(Text.of(fieldNameInTable.of(columnWithNumber(3))), equals(field2)),
        Ensure.that(fieldNameInTable.of(columnWithNumber(4)), not(isPresent())),
        Click.on(button('Exit')),
    );

export const ExportFields = () =>
    Task.where(`User is able to export all fields`,
        Ensure.that(button('Export'), isPresent()),
        Click.on(button('Export')),
        Ensure.that(dialog, isPresent()),
        Click.on(button('Export').of(dialog)),
        Ensure.eventually(errorNotification, not(isPresent()))
    );

const actionSection = PageElement.located(By.css('.action-bar').describedAs('Action section'));
const h3 = PageElement.located(By.css('h3').describedAs('title'));

export const SeeAnalyticsFromParametersPanel = (fieldName: string) =>
    Task.where(`User see the analytics for ${fieldName} from parameters panel`,
        Click.on(button('Analytics').of(parametersPanel)),
        Ensure.eventually(Text.of(h3.of(actionSection)), equals(fieldName)),
        Click.on(button('Exit').of(actionSection)),
    );

export const SeeAnalyticsFromListView = (fieldName: string) =>
    Task.where(`User see the analytics for ${fieldName} from parameters panel`,
        Click.on(img('line-chart').describedAs('Analytics').of(rowWithTextInCell(fieldName, 2))),
        Ensure.eventually(Text.of(h3.of(actionSection)), equals(fieldName)),
        Click.on(button('Exit').of(actionSection)),
    );

export const CheckExportedFieldsData = (fieldsId: string[], exportedFields: string) =>
    Task.where(`User is able to check the exported fields data`,
        LoginByApi,
        ExportFieldsByApi(fieldsId),
        Ensure.that(LastResponse.body(), equals(exportedFields))
    );