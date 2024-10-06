import {faker} from '@faker-js/faker';
import {Ensure, isPresent, not} from '@serenity-js/assertions';
import {Check, Duration, TakeNotes, Wait} from '@serenity-js/core';
import {describe, it} from '@serenity-js/playwright-test';
import {By, Click, isEnabled, Navigate, PageElement} from '@serenity-js/web';

import {LoginByApi, UnlockOrganization} from '../apiCalls';
import {creds} from '../config';
import {Login} from '../login-logout/tasks';
import {drawButton} from '../map-view/elements';
import {
    CreateField,
    DrawField, fieldName, filePath1, filePath2, filePath3, filePath4, filePath5, regionItem, UploadFields
} from '../map-view/tasks';
import {CreateAgronomist, firstNameInput, lastNameInput, userEmailInput} from '../users/tasks';
import {dialog, dialogWithTittle} from '../utils/dialog';
import {button, dayLeft, filterInput, img, item, menuItem, tag} from '../utils/elements';
import {EnsurePopupWithMessage} from '../utils/popup';
import {rowWithTextInCell} from '../utils/table';
import {CleanData, ExportFields, SeeAnalyticsFromListView} from './task';

describe('Admin flow', () => {
    const email = faker.internet.email({provider: 'test.com'});
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    it('Verify the Admin is able to creates user, creates field, uploads fields and locks the organization', async ({actorCalled}) => {

        await actorCalled('Alice')
            .whoCan(TakeNotes.usingAnEmptyNotepad())
            .attemptsTo(
                Login(creds.admin2),
                Click.on(button('Manage Users')),
                CreateAgronomist(firstName, lastName, email),
                Click.on(button('Exit')),
                Check.whether(drawButton, not(isPresent())).andIfSo(
                    LoginByApi,
                    UnlockOrganization(creds.admin2.orgId),
                    Navigate.to('/map-view'),
                ),
                DrawField(),
                CreateField(firstName + ' ' + lastName),
                UploadFields([filePath1, filePath2, filePath3, filePath4, filePath5]),
                Click.on(menuItem('List view')),
                Wait.for(Duration.ofSeconds(2)),
                Wait.until(rowWithTextInCell('safrinha_br_1', 2), isPresent()),
                Ensure.eventually(button('Lock'), isEnabled()),
                Click.on(button('Lock')),
                Ensure.that(dialog, isPresent()),
                Click.on(button('Lock').of(dialog)),
                EnsurePopupWithMessage('The organization Glovo was successfully locked.'),
                Ensure.that(dayLeft, isPresent()),
                Ensure.that(tag('130'), isPresent()),
                Ensure.that(tag('Locked').of(rowWithTextInCell(fieldName, 2)), isPresent()),
                Ensure.that(img('environment').of(rowWithTextInCell(fieldName, 2)), isPresent()),
                Ensure.that(img('edit').of(rowWithTextInCell(fieldName, 2)), isPresent()),
                Ensure.that(img('delete').of(rowWithTextInCell(fieldName, 2)), not(isPresent())),
                Ensure.that(img('line-chart').of(rowWithTextInCell(fieldName, 2)), isPresent()),
                SeeAnalyticsFromListView(fieldName),
                Click.on(img('filter')),
                Click.on(filterInput( 'Select category')),
                Click.on(item('Region')),
                Click.on(filterInput('Select option')),
                Click.on(item(regionItem)),
                Click.on(PageElement.located(By.css('.ant-popover'))),
                Click.on(button('Filter').of(PageElement.located(By.css('.ant-popover').describedAs('Filter dropdown')))),
                Wait.for(Duration.ofSeconds(2)),
                Wait.until(tag(`Region: ${regionItem}`).of(rowWithTextInCell(fieldName, 2)), isPresent()),
                ExportFields(),
                Click.on(button('Manage Users')),
                Wait.until(rowWithTextInCell(email, 2), isPresent()),
                Ensure.that(button('Add user'), isEnabled()),
                Ensure.that(img('delete').of(rowWithTextInCell(email, 2)), isEnabled()),
                Ensure.that(img('edit').of(rowWithTextInCell(email, 2)), isEnabled()),
                Click.on(img('edit').of(rowWithTextInCell(email, 2))),
                Ensure.that(dialogWithTittle('Edit user'), isPresent()),
                Ensure.that(firstNameInput.of(dialogWithTittle('Edit user')), isEnabled()),
                Ensure.that(lastNameInput.of(dialogWithTittle('Edit user')), isEnabled()),
                Ensure.that(userEmailInput, not(isEnabled())),
                Click.on(button('Cancel').of(dialogWithTittle('Edit user'))),
                Click.on(button('Exit')),
                Wait.until(menuItem('Map view'), isPresent()),
                Click.on(menuItem('Map view')),
                Ensure.that(drawButton, not(isPresent())),
                CleanData(creds.admin2.orgId, email, 'agronomist')
            )
    });
});
