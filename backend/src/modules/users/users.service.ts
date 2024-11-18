import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({ status: 1 });
    if (!users?.length) {
      throw new NotFoundException('Users not found');
    }
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id, status: 1 });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      email: createUserDto.email,
      status: 1,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await argon2.hash(createUserDto.password);
    const user = new User({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.em.persistAndFlush(user);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ id, status: 1 });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;
    if (updateUserDto.isGoogleCalendarEnabled)
      user.isGoogleCalendarEnabled = updateUserDto.isGoogleCalendarEnabled;
    this.em.assign(user, updateUserDto);
    await this.em.flush();
    return user;
  }

  async remove(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ id, status: 1 });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      user.status = 0;
      await this.em.flush();
      return `User #${id} has been successfully deactivated`;
    } catch {
      throw new InternalServerErrorException('Failed to deactivate user');
    }
  }
}
