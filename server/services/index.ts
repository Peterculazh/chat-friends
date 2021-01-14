import { asClass } from 'awilix';
import FriendService from './FriendService';
import RepositoryService from './RepositoryService';
import UserService from './UserService';

export interface IServicesContainer{
    UserService: UserService,
    RepositoryService: RepositoryService,
    FriendService: FriendService,
}

export default {
    UserService: asClass(UserService).singleton(),
    RepositoryService: asClass(RepositoryService).singleton(),
    FriendService: asClass(FriendService).singleton(),
}