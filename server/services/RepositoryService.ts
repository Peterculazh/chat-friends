import { User } from "../entity/User";
import { Repository } from "typeorm";
import { IServerContainer } from "../container";
import ServerContext from "../ServerContext";

export default class MainService extends ServerContext {

    public UserRepository: Repository<User>;
    // public GameRepository: Repository<Game>;

    constructor(options: IServerContainer){
        super(options);
        this.UserRepository = this.di.db.connection.getRepository(User);
        // this.GameRepository = this.di.db.connection.getRepository(Game);
    }

}