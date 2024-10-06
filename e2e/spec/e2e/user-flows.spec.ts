import {TakeNotes} from '@serenity-js/core';
import {describe, it} from '@serenity-js/playwright-test';
import {Click} from '@serenity-js/web';

import {creds} from '../config';
import {Login} from '../login-logout/tasks';
import {SearchField, SelectItemFromSearch} from '../map-view/search';
import {
    checkboxSelectAll,
    menuItem
} from '../utils/elements';
import {AddIrrigationFromParametersPanel} from '../utils/irrigation';
import {
    CheckExportedFieldsData,
    CompereTwoFields,
    ExportFields,
    SeeAnalyticsFromParametersPanel
} from './task';

describe('User flow', () => {

    it('Verify the Agronomist is able to search field, see field analytics, add irrigation, compere fields and export fields', async ({actorCalled}) => {
        await actorCalled('Bob')
            .whoCan(TakeNotes.usingAnEmptyNotepad())
            .attemptsTo(
                Login(creds.user),
                SearchField('safrinha_br_2(A)'),
                SelectItemFromSearch('safrinha_br_2(A), Cotton'),
                SeeAnalyticsFromParametersPanel('safrinha_br_2(A)'),
                AddIrrigationFromParametersPanel(10),
                Click.on(menuItem('List view')),
                CompereTwoFields('safrinha_br_3', 'safrinha_br_4'),
                Click.on(checkboxSelectAll),
                ExportFields(),
                CheckExportedFieldsData(creds.user.fieldsId, creds.user.exportedFields)
            )
    });
});