import { asClass } from 'awilix';
import RepositoryService from './RepositoryService';
import UserService from './UserService';

export interface IServicesContainer{
    UserService: UserService,
    RepositoryService: RepositoryService,
}

export default {
    UserService: asClass(UserService).singleton(),
    RepositoryService: asClass(RepositoryService).singleton(),
}