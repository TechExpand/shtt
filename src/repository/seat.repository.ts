import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Seatbs } from '../domain/seat.entity';
import { Injectable } from '@nestjs/common';

// @EntityRepository(Seatbs)
// export class SeatRepository extends Repository<Seatbs> {}

@Injectable()
export class SeatRepository extends Repository<Seatbs> {
  constructor(private dataSource: DataSource) {
    super(Seatbs, dataSource.createEntityManager());
  }

  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}

