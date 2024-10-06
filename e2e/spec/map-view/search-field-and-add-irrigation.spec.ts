import {describe, it} from '@serenity-js/playwright-test';

import {creds} from '../config';
import {Login} from '../login-logout/tasks';
import {AddIrrigationFromParametersPanel} from '../utils/irrigation';
import {SearchField, SelectItemFromSearch} from './search';

describe('Map_view_tab_Users', () => {

    it('Verify the User is able to add irrigation', async ({actorCalled}) => {
        await actorCalled('Alice').attemptsTo(
            Login(creds.user),
            SearchField('safrinha_br_2(A)'),
            SelectItemFromSearch('safrinha_br_2(A), Cotton'),
            AddIrrigationFromParametersPanel(3),
        )
    })
});