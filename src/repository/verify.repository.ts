import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/service/dto/user.dto';
import { Verifybs } from 'src/domain/verify.entity';

// @EntityRepository(User)
// export class UserRepository extends Repository<User> {}



@Injectable()
export class VerifyRepository extends Repository<Verifybs> {
  constructor(private dataSource: DataSource) {
    super(Verifybs, dataSource.createEntityManager());
  }
  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}



