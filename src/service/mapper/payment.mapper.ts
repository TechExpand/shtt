import { Paymentbs } from '../../domain/payment.entity';
import { PaymentDTO } from '../dto/payment.dto';


/**
 * A Payment mapper object.
 */
export class PaymentMapper {

  static fromDTOtoEntity (entityDTO: PaymentDTO): Paymentbs {
    if (!entityDTO) {
      return;
    }
    let entity = new Paymentbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Paymentbs): PaymentDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new PaymentDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
