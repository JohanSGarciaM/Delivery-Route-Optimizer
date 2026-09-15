import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Route } from './route.entity.js';

@Entity('deliveries')
export class Delivery {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    placeId: string;

    @Column()
    address: string;

    @Column('double precision')
    latitude: number;

    @Column('double precision')
    longitude: number;

    @Column()
    optimizedOrder: number;

    @ManyToOne(() => Route, (route) => route.deliveries, {
        onDelete: 'CASCADE',
    })

    @JoinColumn({ name: 'routeId' })
    route: any;

    @Column()
    routeId: string;
    
}