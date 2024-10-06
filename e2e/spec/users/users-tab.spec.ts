import {faker} from '@faker-js/faker';
import {Ensure, isPresent, not} from '@serenity-js/assertions';
import {Check, Duration, Wait} from '@serenity-js/core';
import {describe, it} from '@serenity-js/playwright-test';
import {Click, Enter} from '@serenity-js/web';

import {creds} from '../config';
import {Login} from '../login-logout/tasks';
import {dialog, dialogWithTittle} from '../utils/dialog';
import {button, img} from '../utils/elements';
import {EnsurePopupWithMessage} from '../utils/popup';
import {rowWithTextInCell} from '../utils/table';
import {CreateAgronomist, firstNameInput, lastNameInput} from './tasks';

describe('Manage_users_tab', () => {
    const email = faker.internet.email({provider: 'test.com'});
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    it('Verify the Admin is able to add the user', async ({actorCalled}) => {

        await actorCalled('Alice').attemptsTo(
            Login(creds.admin2),
            Click.on(button('Manage Users')),
            CreateAgronomist(firstName, lastName, email),
            Wait.until(rowWithTextInCell(email, 2), isPresent())
        );

    })

    it('Verify the Admin is able to edit the user', async ({actorCalled}) => {

        await actorCalled('Alice').attemptsTo(
            Login(creds.admin2),
            Click.on(button('Manage Users')),
            Wait.for(Duration.ofSeconds(2)),
            Check.whether(rowWithTextInCell(email, 2), not(isPresent()))
                .andIfSo(
                    CreateAgronomist(firstName, lastName, email),
                    Wait.for(Duration.ofSeconds(2)),
                    Wait.until(rowWithTextInCell(email, 2), isPresent())
                ),
            Click.on(img('edit').of(rowWithTextInCell(email, 2))),
            Enter.theValue(firstName + 1).into(firstNameInput),
            Enter.theValue(lastName).into(lastNameInput),
            Click.on(button('Save').of(dialogWithTittle('Edit user'))),
            EnsurePopupWithMessage('All changes were successfully saved.'),
            Ensure.that(rowWithTextInCell(email, 2), isPresent()),
        );
    })

    it('Verify the Admin is able to delete the user', async ({actorCalled}) => {

        await actorCalled('Alice').attemptsTo(
            Login(creds.admin2),
            Click.on(button('Manage Users')),
            Wait.for(Duration.ofSeconds(2)),
            Check.whether(rowWithTextInCell(email, 2), not(isPresent()))
                .andIfSo(
                    CreateAgronomist(firstName, lastName, email),
                    Wait.for(Duration.ofSeconds(2)),
                    Wait.until(rowWithTextInCell(email, 2), isPresent())
                ),
            Click.on(img('delete').of(rowWithTextInCell(email, 2))),
            Ensure.that(dialog, isPresent()),
            Click.on(button('Delete').of(dialog)),
            EnsurePopupWithMessage(`The user ${firstName + 1} ${lastName} was successfully deleted.`),
            Wait.for(Duration.ofSeconds(3)),
            Ensure.that(rowWithTextInCell(email, 2), not(isPresent()))
        );
    })
});
