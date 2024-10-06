import {faker, fakerEN} from '@faker-js/faker';
import {Ensure, isPresent, not} from '@serenity-js/assertions';
import {Duration, Wait} from '@serenity-js/core';
import {describe, it} from '@serenity-js/playwright-test';
import {Click, Enter, isEnabled} from '@serenity-js/web';

import {creds} from '../config';
import {Login} from '../login-logout/tasks';
import {dialog, dialogWithTittle} from '../utils/dialog';
import {button, img} from '../utils/elements';
import {EnsurePopupWithMessage} from '../utils/popup';
import {rowWithTextInCell} from '../utils/table';
import {address, adminEmail, adminLastName, adminName, orgName, phoneNumber, tab} from './elements';

describe('Global_Administrator_functionality', () => {
    const email = faker.internet.email({provider: 'test.com'});
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const organizationName = fakerEN.company.name();

    it('Verify the Global Admin is able to create the company with Admin user', async ({actorCalled}) => {

        await actorCalled('Alice').attemptsTo(
            Login(creds.superAdmin),
            Click.on(button('Add organization')),
            Enter.theValue(organizationName).into(orgName),
            Enter.theValue('+3800030303').into(phoneNumber),
            Enter.theValue('Main St, NY, USA').into(address),
            Click.on(button('Next').of(dialogWithTittle('Add organization'))),
            Enter.theValue(firstName).into(adminName),
            Enter.theValue(lastName).into(adminLastName),
            Enter.theValue(email).into(adminEmail),
            Click.on(button('Next').of(dialogWithTittle('Add organization'))),
            Click.on(button('Add').of(dialogWithTittle('Add organization'))),
            EnsurePopupWithMessage(`New organization ${organizationName} was successfully added.`),
            Wait.for(Duration.ofSeconds(3)),
            Ensure.that(rowWithTextInCell(organizationName, 1), isPresent())
        );
    })

    it('Verify the Global Admin is able to edit the company', async ({actorCalled}) => {

        await actorCalled('Alice').attemptsTo(
            Login(creds.superAdmin),
            Ensure.eventually(rowWithTextInCell(email, 5), isPresent()),
            Click.on(img('edit').of(rowWithTextInCell(email, 5))),
            Ensure.that(dialogWithTittle('Edit organization'), isPresent()),
            Enter.theValue(organizationName).into(orgName.of(dialogWithTittle('Edit organization'))),
            Enter.theValue('+3800030308').into(phoneNumber.of(dialogWithTittle('Edit organization'))),
            Enter.theValue('Busy St, NY, USA').into(address.of(dialogWithTittle('Edit organization'))),
            Click.on(tab('Admin').of(dialogWithTittle('Edit organization'))),
            Enter.theValue(firstName).into(adminName.of(dialogWithTittle('Edit organization'))),
            Enter.theValue(lastName).into(adminLastName.of(dialogWithTittle('Edit organization'))),
            Ensure.that(adminEmail.of(dialogWithTittle('Edit organization')), not(isEnabled())),
            Click.on(button('Save').of(dialogWithTittle('Edit organization'))),
            EnsurePopupWithMessage('All changes were successfully saved.'),
            Wait.until(rowWithTextInCell(organizationName, 1), isPresent())
        );
    })

    it('Verify the Global Admin is able to delete the company', async ({actorCalled}) => {

        await actorCalled('Alice').attemptsTo(
            Login(creds.superAdmin),
            Ensure.eventually(rowWithTextInCell(email, 5), isPresent()),
            Click.on(img('delete').of(rowWithTextInCell(email, 5))),
            Ensure.that(dialog, isPresent()),
            Click.on(button('Delete').of(dialog)),
            EnsurePopupWithMessage(`The Organization ${organizationName} was successfully deleted.`),
            Wait.for(Duration.ofSeconds(3)),
            Ensure.that(rowWithTextInCell(email, 5), not(isPresent()))
        );
    })

});
