import {Duration, Task, Wait} from '@serenity-js/core';
import {By, Click, Enter, Navigate, PageElement} from '@serenity-js/web';

import {button} from '../utils/elements';

export const emailInput = PageElement.located(By.css('[name=username]')).describedAs('email input');
export const passwordInput = PageElement.located(By.css('[name=password]')).describedAs('password input');// eslint-disable-next-line @typescript-eslint/no-var-requires

export const Login = (user: { username: string, pass: string }) => {
    return Task.where(`#actor login into app`,
        Navigate.to('/map-view'),
        Enter.theValue(user.username).into(emailInput),
        Enter.theValue(user.pass).into(passwordInput),
        Click.on(button('Sign in')),
        Wait.for(Duration.ofSeconds(2))
    );
}