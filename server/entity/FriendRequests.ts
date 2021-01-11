import { BaseEntity, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class FriendRequests extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => User, user => user.id)
    userId!: number;


    @ManyToMany(() => User, user => user.requests)
    requests!: User[];

}