import {DefaultCrudRepository} from '@loopback/repository';
import {Link, LinkRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LinkRepository extends DefaultCrudRepository<
  Link,
  typeof Link.prototype.id,
  LinkRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Link, dataSource);
  }
}
