import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/service/dto/user.dto';

// @EntityRepository(User)
// export class UserRepository extends Repository<User> {}



@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}

