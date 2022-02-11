import { Column, Entity } from 'typeorm';

@Entity('users')
export class User {
  @Column({ primary: true, nullable: false, generated: 'uuid' })
  id: string;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ name: 'created_at', nullable: false })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @Column()
  password: string;
}
