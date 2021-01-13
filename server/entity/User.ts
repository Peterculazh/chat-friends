import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { FriendList } from "./FriendList";
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    password!: string;

    @ManyToMany(() => FriendList, friendList => friendList.incomingRequests)
    incomingRequests!: FriendList[];

    @ManyToMany(() => FriendList, friendList => friendList.outcomingRequests)
    outcomingRequests!: FriendList[];

}