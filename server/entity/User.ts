import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { FriendRequests } from "./FriendRequests";
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    friends!: number;

    @Column()
    password!: string;

    @ManyToMany(() => FriendRequests, friendRequests => friendRequests.incomingRequests)
    incomingRequests!: FriendRequests[];

    @ManyToMany(() => FriendRequests, friendRequests => friendRequests.outcomingRequests)
    outcomingRequests!: FriendRequests[];

}