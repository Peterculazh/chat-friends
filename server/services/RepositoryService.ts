import { User } from "../entity/User";
import { Repository } from "typeorm";
import { IServerContainer } from "../container";
import ServerContext from "../ServerContext";
import { FriendList } from "../entity/FriendList";

export default class MainService extends ServerContext {

    public UserRepository: Repository<User>;
    public FriendListRepository: Repository<FriendList>;

    constructor(options: IServerContainer){
        super(options);
        this.UserRepository = this.di.db.connection.getRepository(User);
        this.FriendListRepository = this.di.db.connection.getRepository(FriendList);
    }

}