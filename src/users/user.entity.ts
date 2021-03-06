import { Column, Entity } from 'typeorm';

export enum TokenType {
  VERIFY_EMAIL = 'VE',
  AUTHENTICATION = 'AT',
}

export enum Status {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export interface Token {
  type: TokenType;
  tokenString: string;
}

export interface SlimUser {
  id: string,
  name: string,
  email: string,
  status: string
}

export interface PasswordData {
  password: string;
  salt: string;
  previous: [];
  last_updated_at: Date;
}

@Entity('users')
export class User {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ name: 'created_at', nullable: false })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @Column({ name: 'password_data', nullable: false, type: 'jsonb' })
  passwordData: PasswordData;

  @Column({ name: 'active_tokens', type: 'jsonb' })
  activeTokens: Token[];

  @Column({ nullable: false })
  status: Status;

  slim(): SlimUser {
    return {
      id: this.id,
      name: `${this.firstName} ${this.lastName}`,
      email: this.email,
      status: this.status
    }
  }
}
