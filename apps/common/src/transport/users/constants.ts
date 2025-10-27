export const TRANSPORT_USER_KAFKA='TRANSPORT_USER_KAFKA';
export const TRANSPORT_USER_NATS='TRANSPORT_USER_NATS';
export const TRASPORT_USER_GROUP='TRANSPORT_USER_GROUP';

export enum UserTopics {
    createUser='create.user',
    editUser='edit.user',
    removeUser='remove.user',
}

export enum UserSubject {
    changePasswordUser='change.password.user',
    loginUser='login.user',
    logoutUser='logout.user',
    refreshTokenUser='refresh.token.user',
    getUser='get.user',
    getUsers='get.users'
}

export const userTopics=Object.values(UserTopics);