import {Ensure, equals, isPresent} from '@serenity-js/assertions';
import {Wait} from '@serenity-js/core';
import {describe, it} from '@serenity-js/playwright-test';
import {By, Click, isVisible, PageElement, Text} from '@serenity-js/web';

import {creds} from '../config';
import {button, img} from '../utils/elements';
import {Login} from './tasks';

describe('Login/Logout', () => {

    it('Verify the Global Admin is able to login with valid credentials', async ({actorCalled}) => {
        await actorCalled('Alice').attemptsTo(
            Login(creds.superAdmin),
            Ensure.that(Text.of(PageElement.located(By.css('.ant-typography')).describedAs('Title')), equals('Nave Analytics'))
        );
    })

    it('Verify the Organization Admin is able to log out', async ({actorCalled}) => {
        await actorCalled('Alice').attemptsTo(
            Login(creds.admin2),
            Click.on(img('user')),
            Click.on(button('Log out')),
            Wait.until(button('Sign in'), isVisible()),
            Ensure.that(button('Sign in'), isPresent())
        );
    })
});
