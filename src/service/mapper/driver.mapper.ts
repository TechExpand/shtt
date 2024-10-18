import { Driverbs } from '../../domain/driver.entity';
import { DriverDTO } from '../dto/driver.dto';


/**
 * A Driver mapper object.
 */
export class DriverMapper {

  static fromDTOtoEntity (entityDTO: DriverDTO): Driverbs {
    if (!entityDTO) {
      return;
    }
    let entity = new Driverbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Driverbs): DriverDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new DriverDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
