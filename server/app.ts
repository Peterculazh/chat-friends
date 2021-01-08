import container, { IServerContainer } from "./container";
import awilix from 'awilix';
import ExpressServer from "./server";

export default class Application {

    public container: awilix.AwilixContainer<IServerContainer>;

    constructor() {

        this.container = container;

        // Creating instances of classes
        container.resolve<ExpressServer>('server');
        container.resolve('db');

        // Working with instances of classes
        container.cradle.db.init();
        container.cradle.server.setContainer(container);
        container.cradle.server.initialize();
    }
}