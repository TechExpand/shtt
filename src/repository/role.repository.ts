import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Ticketbs } from '../domain/ticket.entity';
import { Injectable } from '@nestjs/common';
import { Rolebs } from 'src/domain/role.entity';

// @EntityRepository(Ticketbs)
// export class TicketRepository extends Repository<Ticketbs> {}


@Injectable()
export class RoleRepository extends Repository<Rolebs> {
  constructor(private dataSource: DataSource) {
    super(Rolebs, dataSource.createEntityManager());
  }

  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}

