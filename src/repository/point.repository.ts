import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Pointbs } from '../domain/point.entity';
import { Injectable } from '@nestjs/common';

// @EntityRepository(Pointbs)
// export class PointRepositorys extends Repository<Pointbs> {}


@Injectable()
export class PointRepositorys extends Repository<Pointbs> {
  constructor(private dataSource: DataSource) {
    super(Pointbs, dataSource.createEntityManager());
  }

  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}


// @EntityRepository(Routebs)
// export class RouteRepository extends Repository<Routebs> {}
