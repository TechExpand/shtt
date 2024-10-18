import { DataSource, Repository } from 'typeorm';
import { Seatbs } from '../domain/seat.entity';
import { Injectable } from '@nestjs/common';
import { Shuttlebs } from 'src/domain/shuttle.entity';


@Injectable()
export class ShuttleRepository extends Repository<Shuttlebs> {
  constructor(private dataSource: DataSource) {
    super(Shuttlebs, dataSource.createEntityManager());
  }

  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}

