import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Ticketbs } from '../domain/ticket.entity';
import { Injectable } from '@nestjs/common';

// @EntityRepository(Ticketbs)
// export class TicketRepository extends Repository<Ticketbs> {}


@Injectable()
export class TicketRepository extends Repository<Ticketbs> {
  constructor(private dataSource: DataSource) {
    super(Ticketbs, dataSource.createEntityManager());
  }

  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}

