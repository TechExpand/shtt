import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Authority } from '../domain/authority.entity';
import { Injectable } from '@nestjs/common';

@EntityRepository(Authority)
export class AuthorityRepository extends Repository<Authority> {}



// @Injectable()
// export class AuthorityRepository {
//   constructor(private dataSource: DataSource) { }

//   exampleQueryBuilder() {
//     return this.dataSource
//         .getRepository(Authority)
//         .createQueryBuilder()
//   }
// }