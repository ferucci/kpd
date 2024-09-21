import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Repository,
  DataSource,
  FindOneOptions,
  DeleteResult,
  FindManyOptions,
} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashValue } from 'src/heplers/hash';
import { ChekingEndingEntity, editForbidden, MSG_ERROR } from 'src/vars';

@Injectable()
export class UserService {
  constructor(
    private dataSourse: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password } = createUserDto;
      const user = this.userRepository.create({
        ...createUserDto,
        password: await hashValue(password),
      });

      return this.userRepository.save(user);
    } catch (error) {
      throw new UnauthorizedException(MSG_ERROR.notAuth);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return this.userRepository.save(createUserDto);
    } catch (error) {
      throw new UnauthorizedException(MSG_ERROR.inc_data);
    }
  }

  async findOne(query: FindOneOptions<User>): Promise<User> | null {
    try {
      return await this.userRepository.findOne(query);
    } catch (error) {
      throw new NotFoundException(MSG_ERROR.eget);
    }
  }

  async find(query: FindManyOptions<User>): Promise<User[]> {
    try {
      return await this.userRepository.find(query);
    } catch (error) {
      throw new NotFoundException(MSG_ERROR.eget);
    }
  }

  async update(
    query: FindOneOptions<User>,
    updateUserDto: UpdateUserDto,
    user: User,
  ) {
    const { password } = updateUserDto;
    const foundUser = await this.findOne(query);

    if (password) {
      updateUserDto.password = await hashValue(password);
    }

    if (updateUserDto.username !== user.username)
      throw new ForbiddenException(editForbidden(ChekingEndingEntity.account));
    return this.userRepository.save({ ...foundUser, ...updateUserDto });
  }

  async removeOne(query: Partial<User>, userId: number): Promise<DeleteResult> {
    const { id } = query;
    const user = await this.findOne({
      where: { id },
    });
    if (user.id !== userId)
      throw new ForbiddenException(editForbidden(ChekingEndingEntity.account));

    return await this.userRepository.delete(query);
  }
}
