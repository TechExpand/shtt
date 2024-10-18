import { Notificationbs } from 'src/domain/notification.entity';
import { Ticketbs } from '../../domain/ticket.entity';
import { NotificationDTO } from '../dto/notification.dto';
import { TicketDTO } from '../dto/ticket.dto';


/**
 * A Ticket mapper object.
 */
export class NotificationMapper {

  static fromDTOtoEntity (notificationDTO: NotificationDTO): Notificationbs {
    if (!notificationDTO) {
      return;
    }
    let entity = new Notificationbs();
    const fields = Object.getOwnPropertyNames(notificationDTO);
    fields.forEach(field => {
        entity[field] = notificationDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Notificationbs): NotificationDTO {
    if (!entity) {
      return;
    }
    let notificationDTO = new NotificationDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        notificationDTO[field] = entity[field];
    });

    return notificationDTO;
  }
}
