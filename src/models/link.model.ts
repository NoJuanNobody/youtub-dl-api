import {Entity, model, property} from '@loopback/repository';

@model()
export class Link extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  url: string;


  constructor(data?: Partial<Link>) {
    super(data);
  }
}

export interface LinkRelations {
  // describe navigational properties here
}

export type LinkWithRelations = Link & LinkRelations;
