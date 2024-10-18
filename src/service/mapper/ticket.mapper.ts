import { Ticketbs } from '../../domain/ticket.entity';
import { TicketDTO } from '../dto/ticket.dto';


/**
 * A Ticket mapper object.
 */
export class TicketMapper {

  static fromDTOtoEntity (entityDTO: TicketDTO): Ticketbs {
    if (!entityDTO) {
      return;
    }
    let entity = new Ticketbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Ticketbs): TicketDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new TicketDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
