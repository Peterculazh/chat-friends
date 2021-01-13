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
        let friendList;
        let friendListArray = await this.di.RepositoryService.FriendListRepository
            .find({
                relations: ['user']
            });
        friendList = friendListArray.find(friendList => friendList.user.id === user.id);
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

    public async acceptFriend(targetId: number, sourceId: number) {
        const [targetUser, sourceUser] = await Promise.all([
            this.di.RepositoryService.UserRepository.findOne(targetId),
            this.di.RepositoryService.UserRepository.findOne(sourceId)
        ]);
        if (targetUser && sourceUser) {
            await Promise.all([
                this.removeIncomingRequest(targetUser, sourceUser),
                this.removeOutcomingRequest(sourceUser, targetUser)
            ]);
            return await this.addToFriend(sourceUser, targetUser);
        }
    }

    public async declineFriend(targetId: number, sourceId: number) {
        const [targetUser, sourceUser] = await Promise.all([
            this.di.RepositoryService.UserRepository.findOne(targetId),
            this.di.RepositoryService.UserRepository.findOne(sourceId)
        ]);
        if (targetUser && sourceUser) {
            return await Promise.all([
                this.removeIncomingRequest(targetUser, sourceUser),
                this.removeOutcomingRequest(sourceUser, targetUser)
            ]);
        }
    }

    public async removeIncomingRequest(targetUser: User, sourceUser: User, friendList?: FriendList) {
        if (!friendList) {
            friendList = await this.getOrCreateFriendListEntity(targetUser);
        }
        friendList.incomingRequests = friendList.incomingRequests.filter(user => {
            console.log("incoming", user.id, sourceUser.id, user.id !== sourceUser.id);
            return user.id !== sourceUser.id;
        });
        console.log("enter request incoming");
        return await this.di.RepositoryService.FriendListRepository.save(friendList);
    }

    public async removeOutcomingRequest(targetUser: User, sourceUser: User, friendList?: FriendList) {
        console.log("targetUser", targetUser)
        if (!friendList) {
            friendList = await this.getOrCreateFriendListEntity(targetUser);
        }
        console.log("enter request outcoming");
        friendList.outcomingRequests = friendList.outcomingRequests.filter(user => {
            console.log("outcoming", user.id, sourceUser.id, user.id !== sourceUser.id);
            return user.id !== sourceUser.id;
        });
        console.log("outcoming", friendList);
        return await this.di.RepositoryService.FriendListRepository.save(friendList);
    }

    public async addToFriend(user1: User, user2: User) {
        const friendRepository = this.di.RepositoryService.FriendListRepository;
        const [user1FriendList, user2FriendList] = await Promise.all([
            this.getOrCreateFriendListEntity(user1),
            this.getOrCreateFriendListEntity(user2),
        ]);
        user1FriendList.friends = [user2];
        user2FriendList.friends = [user1];
        return await Promise.all([
            friendRepository.save(user1FriendList),
            friendRepository.save(user2FriendList),
        ])
    }
}