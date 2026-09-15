import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Delivery } from './delivery.entity.js';

@Entity('routes')
export class Route {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    originAddress: string;

    @Column('double precision')
    originLatitude: number;

    @Column('double precision')
    originLongitude: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Delivery, (delivery) => delivery.route)
    deliveries: any[];
}