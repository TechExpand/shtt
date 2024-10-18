import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { Pinbs } from 'src/domain/pin.entity';

// @EntityRepository(User)
// export class UserRepository extends Repository<User> {}



@Injectable()
export class PinRepository extends Repository<Pinbs> {
  constructor(private dataSource: DataSource) {
    super(Pinbs, dataSource.createEntityManager());
  }
  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}



