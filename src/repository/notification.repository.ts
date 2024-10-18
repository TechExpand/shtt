import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Ticketbs } from '../domain/ticket.entity';
import { Injectable } from '@nestjs/common';
import { Notificationbs } from 'src/domain/notification.entity';

// @EntityRepository(Ticketbs)
// export class TicketRepository extends Repository<Ticketbs> {}


@Injectable()
export class NotificationRepository extends Repository<Notificationbs> {
  constructor(private dataSource: DataSource) {
    super(Notificationbs, dataSource.createEntityManager());
  }

  // async createOrganization({ title, description }: UserDTO):Promise<User> {}
}

