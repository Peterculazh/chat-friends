import ServerContext from "../ServerContext";
import bcrypt from 'bcrypt';
import { User } from "../entity/User";


export default class GameService extends ServerContext {


    public async createUser(data: any) {
        if ((data?.nickname && data?.password) && (data.nickname.length !== 0 && data.password.length !== 0)) {
            const user = new User();
            user.name = data.nickname;
            user.password = await bcrypt.hash(data.password, 10);
            return await this.di.RepositoryService.UserRepository.save(user);
        }
        else {
            throw Error("Incorrect data");
        }
    }

    public async getUser(data: any) {
        if ((data?.nickname && data?.password) && (data.nickname.length !== 0 && data.password.length !== 0)) {
            const user = await this.di.RepositoryService.UserRepository.findOne({ name: data.nickname });
            return user;
        }
        else {
            throw Error("Incorrect data");
        }
    }
}