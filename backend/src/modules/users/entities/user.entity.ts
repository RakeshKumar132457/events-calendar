import { BaseEntity } from '@common/entities/base.entity';
import { Entity, Property, Unique } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User extends BaseEntity {
  @Property()
  @Unique()
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;

  @Property({ default: 1 })
  status: number = 1;

  @Property({ default: false })
  isGoogleCalendarEnabled: boolean = false;

  @Property({ nullable: true })
  googleCalendarToken?: string;

  constructor(data: Partial<User>) {
    super();
    Object.assign(this, data);
  }
}
