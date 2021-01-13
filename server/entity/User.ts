import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FriendList } from "./FriendList";
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    password!: string;

    @OneToOne(() => FriendList, friendList => friendList.user, { cascade: true })
    @JoinColumn()
    friendList!: FriendList;

    @ManyToMany(() => FriendList, friendList => friendList.incomingRequests)
    incomingRequests!: FriendList[];

    @ManyToMany(() => FriendList, friendList => friendList.outcomingRequests)
    outcomingRequests!: FriendList[];

}