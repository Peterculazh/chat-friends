import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { FriendRequests } from "./FriendRequests";
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    password!: string;

    @Column("int", { array: true, nullable: true })
    array!: number[];

    @Column({ nullable: true })
    token!: string;

    @ManyToMany(() => FriendRequests, friendRequests => friendRequests.requests)
    requests!: FriendRequests[];

}