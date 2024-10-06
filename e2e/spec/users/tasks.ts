import {Task} from '@serenity-js/core';
import {Click, Enter, PageElement} from '@serenity-js/web';

import {dialogWithTittle} from '../utils/dialog';
import {button, byPlaceholder} from '../utils/elements';
import {EnsurePopupWithMessage} from '../utils/popup';

export const firstNameInput = PageElement.located(byPlaceholder('Enter user First name')).describedAs('First Name input');
export const lastNameInput = PageElement.located(byPlaceholder('Enter user Last name')).describedAs('Last Name input');
export const userEmailInput = PageElement.located(byPlaceholder('Enter user email')).describedAs('Email input');

export function CreateAgronomist(firstName: string, lastName: string, email: string) {
    return Task.where('Actor create user',
        Click.on(button('Add user')),
        Enter.theValue(firstName).into(firstNameInput),
        Enter.theValue(lastName).into(lastNameInput),
        Enter.theValue(email).into(userEmailInput),
        Click.on(button('Add').of(dialogWithTittle('Add user'))),
        EnsurePopupWithMessage(`New user ${firstName} ${lastName} was successfully added.`)
    )
}