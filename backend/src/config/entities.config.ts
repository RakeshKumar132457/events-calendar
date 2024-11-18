import { User } from '@modules/users/entities/user.entity';

export const entities = [User];

export const entityPaths = [
  './dist/modules/**/entities/*.entity.js',
  './src/modules/**/entities/*.entity.ts',
];
