import { User } from "../entity/User";
import { FriendList } from "../entity/FriendList";
import ServerContext from "../ServerContext";

export default class FriendService extends ServerContext {



    /**
    *   @returns false | [incomingRequests, outComingRequest]
    */
    public async sendRequestToFriend(targetId: number, sourceId: number) {
        const [targetUser, sourceUser] = await Promise.all([
            this.di.RepositoryService.UserRepository.findOne(targetId),
            this.di.RepositoryService.UserRepository.findOne(sourceId)
        ]);
        if (targetUser && sourceUser) {
            return await Promise.all([
                this.setIncomingRequests(targetUser, sourceUser),
                this.setOutcomingRequests(sourceUser, targetUser)]);
        }
        return false;
    }

    public async setIncomingRequests(targetUser: User, sourceUser: User, friendList?: FriendList) {
        if (!friendList) {
            friendList = await this.getOrCreateFriendListEntity(targetUser);
        }
        friendList.incomingRequests = [sourceUser];
        return await this.di.RepositoryService.FriendListRepository.save(friendList);
    }

    public async setOutcomingRequests(targetUser: User, sourceUser: User, friendList?: FriendList) {
        if (!friendList) {
            friendList = await this.getOrCreateFriendListEntity(targetUser);
        }
        friendList.outcomingRequests = [sourceUser];
        return await this.di.RepositoryService.FriendListRepository.save(friendList);
    }

    public async getOrCreateFriendListEntity(user: User) {
        let friendList = await this.di.RepositoryService.FriendListRepository.findOne({
            relations: ['user'],
            where: {
                "user": user
            }
        });
        if (!friendList) {
            friendList = await this.createFriendListEntity(user);
        }
        return friendList;
    }

    public async createFriendListEntity(user: User) {
        const newFriendListEntity = new FriendList();
        newFriendListEntity.user = user;
        return await this.di.RepositoryService.FriendListRepository.save(newFriendListEntity);
    }
}