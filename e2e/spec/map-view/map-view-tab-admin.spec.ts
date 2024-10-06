import {Ensure, isPresent} from '@serenity-js/assertions';
import {describe, it} from '@serenity-js/playwright-test';

import {DeleteAllUrgFields, LoginByApi} from '../apiCalls';
import {creds} from '../config';
import {Login} from '../login-logout/tasks';
import {drawButton,} from './elements';
import {
    CreateField,
    DrawField
} from './tasks';

describe('Map_view_tab_Admin', () => {

    it('Verify the Organization Admin is able to draw polygon', async ({actorCalled}) => {

        await actorCalled('Alice').attemptsTo(
            Login(creds.admin2),
            Ensure.eventually(drawButton, isPresent()),
            DrawField(),
            CreateField(`${creds.admin2.firstName + ' ' + creds.admin2.lastName} (me)`),
            LoginByApi,
            DeleteAllUrgFields(creds.admin2.orgId)
        );
    })
});