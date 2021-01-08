import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { IServerContainer } from "./container";
import ServerContext from "./ServerContext";

export default class DataBase extends ServerContext {

    public connection!: Connection;
    public context: IServerContainer;

    constructor(opts: IServerContainer) {
        super(opts);
        this.context = opts;
    }

    public async init() {
        try {
            this.connection = await createConnection();
        } catch (err) {
            console.log('DB init error - ', err);
        }
    }
}