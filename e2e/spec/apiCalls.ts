import {Ensure, equals} from '@serenity-js/assertions';
import {
    Interaction,
    List,
    MetaQuestion,
    notes,
    Question,
    Task,
    WithAnswerableProperties
} from '@serenity-js/core';
import {DeleteRequest, GetRequest, LastResponse, PostRequest, PutRequest, Send} from '@serenity-js/rest';

import {apiUserCreds} from './config';

const SaveToken = Interaction.where('', async (actor) => {
    const user = await LastResponse.body<{ access_token: string }>().answeredBy(actor);
    await notes().set<string>('token', `Bearer ${user.access_token}`).performAs(actor);
})

export const LoginByApi = Task.where(
    'Get token',
    Send.a(PostRequest.to(`https://auth-dev.nave-app.com/oauth2/token`)
        .with({grant_type: 'client_credentials', ...apiUserCreds})
        .using({headers: {'Content-Type': 'application/x-www-form-urlencoded'}})),
    Ensure.that(LastResponse.status(), equals(200)),
    SaveToken
);

export const UnlockOrganization = (orgId: string) => Task.where('Unlock Organization',
    Send.a(PutRequest.to(`/api/organizations/${orgId}/unlock`).using(requestConfiguration)),
    Ensure.that(LastResponse.status(), equals(200))
)

export const ExportFieldsByApi = (fieldsId: string[]) => Task.where('Export fields',
    Send.a(PostRequest.to(`/api/fields/export/csv?system=metric&locale=en-US`).with(fieldsId).using(requestConfiguration)),
    Ensure.that(LastResponse.status(), equals(200))
)

type Field = { organization: { id: string }, id: string };
type User = { email: string, id: string };

export const DeleteAllUrgFields = (orgId: string) => Task.where('Delete fields',
    Send.a(GetRequest.to(`/api/fields`).using(requestConfiguration)),
    Ensure.that(LastResponse.status(), equals(200)),
    List.of<Field>(LastResponse.body<Field[]>())
        .where(OrganizationId, equals(orgId))
        .forEach(async ({item: field, actor}) => {
            await Send.a(DeleteRequest.to(`/api/fields/${field.id}`).using(requestConfiguration)).performAs(actor);
            await Ensure.that(LastResponse.status(), equals(200)).performAs(actor);
        })
);

const requestConfiguration: WithAnswerableProperties<{ headers: Record<string, string> }> = {
    headers: {
        Authorization: notes().get('token')
    }
}

const OrganizationId: MetaQuestion<Field, Question<Promise<string>>> = {
    of: (element: Field) =>
        Question.about('fields of organization', async actor => {
            return element.organization.id
        })
}

export const DeleteUserWithEmail = (userEmail: string, role: string) => Task.where('Delete user',
    Send.a(GetRequest.to(`/api/users?role=${role}`)
        .using(requestConfiguration)),
    Ensure.that(LastResponse.status(), equals(200)),
    List.of<User>(LastResponse.body<User[]>())
        .where(UserEmail, equals(userEmail))
        .forEach(async ({item: user, actor}) => {
            await Send.a(DeleteRequest.to(`/api/users/${user.id}`).using(requestConfiguration)).performAs(actor);
            await Ensure.that(LastResponse.status(), equals(200)).performAs(actor);
        })
);

const UserEmail: MetaQuestion<User, Question<Promise<string>>> = {
    of: (element: User) =>
        Question.about('user with email', async actor => {
            return element.email
        })
}