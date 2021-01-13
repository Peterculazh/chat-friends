import { BaseEntity, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class FriendList extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => User, user => user.friendList)
    user!: User;

    @ManyToMany(() => User, { eager: true })
    @JoinTable()
    friends!: User[];

    @ManyToMany(() => User, user => user.outcomingRequests, { cascade: true, eager: true })
    @JoinTable()
    outcomingRequests!: User[];

    @ManyToMany(() => User, user => user.incomingRequests, { cascade: true, eager: true })
    @JoinTable()
    incomingRequests!: User[];

}