import { User } from "../entity/User";
import { FriendRequests } from "../entity/FriendRequests";
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

    public async setIncomingRequests(targetUser: User, sourceUser: User, friendRequest?: FriendRequests) {
        if (!friendRequest) {
            friendRequest = await this.getOrCreateFriendRequestEntity(targetUser);
        }
        friendRequest.incomingRequests = [sourceUser];
        return await this.di.RepositoryService.FriendRequestsRepository.save(friendRequest);
    }

    public async setOutcomingRequests(targetUser: User, sourceUser: User, friendRequest?: FriendRequests) {
        if (!friendRequest) {
            friendRequest = await this.getOrCreateFriendRequestEntity(targetUser);
        }
        friendRequest.outcomingRequests = [sourceUser];
        return await this.di.RepositoryService.FriendRequestsRepository.save(friendRequest);
    }

    public async getOrCreateFriendRequestEntity(user: User) {
        let friendRequest = await this.di.RepositoryService.FriendRequestsRepository.findOne({
            relations: ['user'],
            where: {
                "user": user
            }
        });
        if (!friendRequest) {
            friendRequest = await this.createFriendRequestEntity(user);
        }
        return friendRequest;
    }

    public async createFriendRequestEntity(user: User) {
        const newFriendRequestEntity = new FriendRequests();
        newFriendRequestEntity.user = user;
        return await this.di.RepositoryService.FriendRequestsRepository.save(newFriendRequestEntity)
    }
}