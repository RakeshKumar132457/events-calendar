import { IBaseEntity } from '@common/interfaces/base.interface';

export interface IUser extends IBaseEntity {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isGoogleCalendarEnabled?: boolean;
  googleCalendarToken?: string;
}
