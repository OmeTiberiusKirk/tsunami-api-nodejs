import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['uid'])
@Entity({ name: 'earthquakes' })
export class Earthquake {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  uid: string;

  @Column({ length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column('float')
  magnitude: number;

  @Column('float')
  depth: number;

  @Column('timestamptz')
  time: Date;

  @Column()
  feed_from: string;
}
