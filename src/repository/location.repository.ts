import { Injectable } from "@nestjs/common";
import { Locationbs } from "src/domain/location.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class LocationRepository extends Repository<Locationbs> {
  constructor(private dataSource: DataSource) {
    super(Locationbs, dataSource.createEntityManager());
  }

//   async createOrganization({ title, description }: UserDTO):Promise<User> {}
}

