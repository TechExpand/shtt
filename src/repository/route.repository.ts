import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Seatbs } from '../domain/seat.entity';
import { Injectable } from '@nestjs/common';
import { Routebs } from 'src/domain/route.entity';

@Injectable()
export class RouteRepositorys extends Repository<Routebs> {
  constructor(private dataSource: DataSource) {
    super(Routebs, dataSource.createEntityManager());
  }

  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}


// @EntityRepository(Routebs)
// export class RouteRepository extends Repository<Routebs> {}
