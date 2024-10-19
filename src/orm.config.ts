import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function ormConfig(): TypeOrmModuleOptions {
  const commonConf = {
    SYNCRONIZE: false,
    ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
    MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
    CLI: {
      migrationsDir: 'src/migrations',
    },
    MIGRATIONS_RUN: true,
  };

  let ormconfig: TypeOrmModuleOptions = {
    // name: 'default',
    // type: 'sqlite',
    // database: '../target/db/sqlite-dev-db.sql',

    name: 'shuttle',
    type: 'postgres',
    database: 'defaultdb',
    host: 'pg-42f8939-pikamsell-3fdc.k.aivencloud.com',
    port: 18306,
    username: 'avnadmin',
    password: 'AVNS_3ANekNkSZAQA7vhn0Oh',
    logging: true,
    synchronize: true,
    entities: commonConf.ENTITIES,
    // migrations: commonConf.MIGRATIONS,
    // // cli: commonConf.CLI,
    // migrationsRun: commonConf.MIGRATIONS_RUN,
  };

  // {
  //     // name: 'default',
  //     // type: 'sqlite',
  //     // database: '../target/db/sqlite-dev-db.sql',

  //     name: 'shuttlenet',
  //     type: 'postgres',
  //     database: 'initial_db',
  //     host: 'shuttlenet.cnwkmxf2kced.eu-west-1.rds.amazonaws.com',
  //     port: 5432,
  //     username: 'shuttlenet',
  //     password: 'shuttlenet126',
  //     logging: true,
  //     synchronize: true,
  //     entities: commonConf.ENTITIES,
  //     // migrations: commonConf.MIGRATIONS,
  //     // // cli: commonConf.CLI,
  //     migrationsRun: commonConf.MIGRATIONS_RUN,
  // };

  if (process.env.BACKEND_ENV === 'prod') {
    ormconfig = {
      // name: 'default',
      // type: 'sqlite',
      // database: '../target/db/sqlite-dev-db.sql',

      name: 'shuttle',
      type: 'postgres',
      database: 'defaultdb',
      host: 'pg-42f8939-pikamsell-3fdc.k.aivencloud.com',
      port: 18306,
      username: 'avnadmin',
      password: 'AVNS_3ANekNkSZAQA7vhn0Oh',
      logging: true,
      synchronize: true,
      entities: commonConf.ENTITIES,
      // migrations: commonConf.MIGRATIONS,
      // // cli: commonConf.CLI,
      // migrationsRun: commonConf.MIGRATIONS_RUN,
    };

    // {
    //     name: 'shuttlenet',
    //     type: 'postgres',
    //     database: 'initial_db',
    //     host: 'shuttlenet.cnwkmxf2kced.eu-west-1.rds.amazonaws.com',
    //     port: 5432,
    //     username: 'shuttlenet',
    //     password: 'shuttlenet126',
    //     logging: false,
    //     synchronize: commonConf.SYNCRONIZE,
    //     entities: commonConf.ENTITIES,
    //     migrations: commonConf.MIGRATIONS,
    //     // // cli: commonConf.CLI,
    //     migrationsRun: commonConf.MIGRATIONS_RUN,
    // };
  }

  if (process.env.BACKEND_ENV === 'test') {
    ormconfig = {
      // name: 'default',
      // type: 'sqlite',
      // database: '../target/db/sqlite-dev-db.sql',

      name: 'shuttle',
      type: 'postgres',
      database: 'defaultdb',
      host: 'pg-42f8939-pikamsell-3fdc.k.aivencloud.com',
      port: 18306,
      username: 'avnadmin',
      password: 'AVNS_3ANekNkSZAQA7vhn0Oh',
      logging: true,
      synchronize: true,
      entities: commonConf.ENTITIES,
      // migrations: commonConf.MIGRATIONS,
      // // cli: commonConf.CLI,
      // migrationsRun: commonConf.MIGRATIONS_RUN,
    };

    // {
    //     // name: 'default',
    //     // type: 'sqlite',
    //     // database: ':memory:',

    //     name: 'shuttlenet',
    //     type: 'postgres',
    //     database: 'initial_db',
    //     host: 'shuttlenet.cnwkmxf2kced.eu-west-1.rds.amazonaws.com',
    //     port: 5432,
    //     username: 'shuttlenet',
    //     password: 'shuttlenet126',
    //     keepConnectionAlive: true,
    //     logging: true,
    //     synchronize: true,
    //     entities: commonConf.ENTITIES,
    //     migrations: commonConf.MIGRATIONS,
    //     // // cli: commonConf.CLI,
    //     migrationsRun: commonConf.MIGRATIONS_RUN,
    // };
  }
  return ormconfig;
}

export { ormConfig };
