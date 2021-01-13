import { BaseEntity, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class FriendList extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => User)
    @JoinColumn()
    user!: User;

    @ManyToMany(() => User, user => user.outcomingRequests, { cascade: true, eager: true })
    @JoinTable()
    outcomingRequests!: User[];

    @ManyToMany(() => User, user => user.incomingRequests, { cascade: true, eager: true })
    @JoinTable()
    incomingRequests!: User[];

}