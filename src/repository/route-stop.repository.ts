// import { EntityRepository, Repository } from 'typeorm';
// import { RoutePointbs } from '../domain/route-stop.entity';

// @EntityRepository(RoutePointbs)
// export class RoutePointRepositorys extends Repository<RoutePointbs> {}



import { DataSource, Repository } from 'typeorm';
import { Seatbs } from '../domain/seat.entity';
import { Injectable } from '@nestjs/common';
import { Routebs } from 'src/domain/route.entity';
import { RoutePointbs } from 'src/domain/route-stop.entity';

@Injectable()
export class RoutePointRepositorys extends Repository<RoutePointbs> {
  constructor(private dataSource: DataSource) {
    super(RoutePointbs, dataSource.createEntityManager());
  }

  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}
