import {Answerable, Task} from '@serenity-js/core';
import {Click, PageElement} from '@serenity-js/web';

import {item} from './elements';

export const SelectItemInDropdown = (itemName: string, dropdown: Answerable<PageElement>) =>
    Task.where(`User select the ${itemName} in the ${dropdown}`,
        Click.on(dropdown),
        Click.on(item(itemName))
    );
