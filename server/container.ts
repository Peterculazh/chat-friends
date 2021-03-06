import * as awilix from 'awilix';
import ExpressServer from './server';
import config from '../config';
import DataBase from './db';
import services, { IServicesContainer } from './services';
import Passport from './helpers/passport';
import Socket from './helpers/socket';

export interface IServerContainer extends IServicesContainer {
    config: any;
    server: ExpressServer;
    db: DataBase,
    passport: Passport,
    socket: Socket,
}

const container = awilix.createContainer<IServerContainer>({
    injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
    ...services,
    config: awilix.asValue(config),
    server: awilix.asClass(ExpressServer).singleton(),
    db: awilix.asClass(DataBase).singleton(),
    passport: awilix.asClass(Passport).singleton(),
    socket: awilix.asClass(Socket).singleton(),
});


export default container;