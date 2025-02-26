import { Role } from 'src/role/role.enum'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ length: 500 })
  name: string

  @Column({ length: 500 })
  surName: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role

  @Column('simple-array')
  permissions: string[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
