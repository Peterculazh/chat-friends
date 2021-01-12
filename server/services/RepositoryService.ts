import { User } from "../entity/User";
import { Repository } from "typeorm";
import { IServerContainer } from "../container";
import ServerContext from "../ServerContext";
import { FriendRequests } from "../entity/FriendRequests";

export default class MainService extends ServerContext {

    public UserRepository: Repository<User>;
    public FriendRequestsRepository: Repository<FriendRequests>;

    constructor(options: IServerContainer){
        super(options);
        this.UserRepository = this.di.db.connection.getRepository(User);
        this.FriendRequestsRepository = this.di.db.connection.getRepository(FriendRequests);
    }

}