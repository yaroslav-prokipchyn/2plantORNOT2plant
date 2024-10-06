import {Ensure, equals, isPresent} from '@serenity-js/assertions';
import {Task, Wait} from '@serenity-js/core';
import {By, PageElement, Text} from '@serenity-js/web';

export const errorNotification =
    PageElement.located(By.cssContainingText('.ant-notification', 'error'))
    .describedAs('Error notification');

export const popupMessageWithTxt = (text: string) =>
    PageElement.located(By.cssContainingText('.ant-message-notice-content', text))
        .describedAs('Popup message');

const popupMessage =
    PageElement.located(By.css('.ant-message-notice-content'))
        .describedAs('Popup message');

export const EnsurePopupWithMessage = (text: string) =>
    Task.where(`User see for the ${text} message`,
        Wait.until(popupMessage, isPresent()),
        Ensure.eventually(Text.of(popupMessage), equals(text))
    );
