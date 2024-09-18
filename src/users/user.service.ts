import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, DataSource, FindOneOptions, FindOptionsWhere, DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashValue } from 'src/heplers/hash';

@Injectable()
export class UserService {
  constructor(
    private dataSourse: DataSource,
    // Внедряю сервис базы данных ( @InjectRepository )
    @InjectRepository(User)
    // Получаю доступ к репозитирию юзера
    private readonly userRepository: Repository<User>
  ) { }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const user = this.userRepository.create({
      ...createUserDto,
      password: await hashValue(password)
    });

    return this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto,): Promise<User> {
    try {
      return this.userRepository.save(createUserDto);
    } catch (error) {
      throw new HttpException("Что-то пошло не так", HttpStatus.FORBIDDEN);
    }

  }

  async findOne(query: FindOneOptions<User>): Promise<User> | null {
    const user = await this.userRepository.findOne(query);
    return user || null;
  }

  async update(query: FindOneOptions<User>, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.findOne(query);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }

    return this.userRepository.save({ ...user, ...updateUserDto })
  }

  async removeOne(query: Partial<User>, userId: number): Promise<DeleteResult> {
    const { id } = query;
    const user = await this.findOne({
      where: { id }
    })
    if (user.id === userId) throw new ForbiddenException('Удаление запрещено');

    return await this.userRepository.delete(query);
  }
}
