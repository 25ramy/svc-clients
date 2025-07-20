import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  birthDate: Date;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
