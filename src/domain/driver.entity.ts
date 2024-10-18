/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column} from 'typeorm';
import { BaseEntity } from './base/base.entity';




/**
 * A Driverbs.
 */
@Entity('driver')
export class Driverbs extends BaseEntity  {


    @Column({name: "name" })
    name: string;


    @Column({name: "license_number" })
    licenseNumber: string;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
