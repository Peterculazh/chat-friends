import { IServerContainer } from "./container";

declare global {
    namespace Express {
        interface Response {
            answer: (data: any, message?: any, status?: number) => void;
            print: (pagePath: string, ssrData: any) => void;
        }
    }
}

export default class ServerContext {
    protected di: IServerContainer;

    constructor(options: IServerContainer) {
        this.di = options;
    }
}