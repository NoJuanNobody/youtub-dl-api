import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import fs from 'fs';
import {PassThrough} from 'stream';
import {Link} from '../models';
import {LinkRepository} from '../repositories';
import {convertToAudio, requestVideo as youtubeService} from '../services/AVConverter';
export class LinkController {
  constructor(
    @repository(LinkRepository)
    public linkRepository: LinkRepository,
  ) {}

  @post('/links', {
    responses: {
      '200': {
        description: 'Link model instance',
        content: {'application/json': {schema: fs.ReadStream}},
      },
    },
  })
  async create(
    //type
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Link, {
            title: 'NewLink',
            exclude: ['id'],
          }),
        },
      },
    })
    link: Omit<Link, 'id'>,
  ) {
    console.log(link);
    const ref = await youtubeService(link.url);
    const output = await convertToAudio(link.url);
    // await this.linkRepository.create(link);
    console.log(output, ref);
    const d = new PassThrough();
    fs.createReadStream(`files/${link.url}.mp3`);

    d.pipe(process.stdout);
    d.on('data', console.log)

  }

  // @get('/links/count', {
  //   responses: {
  //     '200': {
  //       description: 'Link model count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async count(
  //   @param.where(Link) where?: Where<Link>,
  // ): Promise<Count> {
  //   return this.linkRepository.count(where);
  // }

  // @get('/links', {
  //   responses: {
  //     '200': {
  //       description: 'Array of Link model instances',
  //       content: {
  //         'application/json': {
  //           schema: {
  //             type: 'array',
  //             items: getModelSchemaRef(Link, {includeRelations: true}),
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Link) filter?: Filter<Link>,
  // ): Promise<Link[]> {
  //   return this.linkRepository.find(filter);
  // }

  // @patch('/links', {
  //   responses: {
  //     '200': {
  //       description: 'Link PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Link, {partial: true}),
  //       },
  //     },
  //   })
  //   link: Link,
  //   @param.where(Link) where?: Where<Link>,
  // ): Promise<Count> {
  //   return this.linkRepository.updateAll(link, where);
  // }

  // @get('/links/{id}', {
  //   responses: {
  //     '200': {
  //       description: 'Link model instance',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(Link, {includeRelations: true}),
  //         },
  //       },
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(Link, {exclude: 'where'}) filter?: FilterExcludingWhere<Link>
  // ): Promise<Link> {
  //   return this.linkRepository.findById(id, filter);
  // }

  // @patch('/links/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Link PATCH success',
  //     },
  //   },
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Link, {partial: true}),
  //       },
  //     },
  //   })
  //   link: Link,
  // ): Promise<void> {
  //   await this.linkRepository.updateById(id, link);
  // }

  // @put('/links/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Link PUT success',
  //     },
  //   },
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() link: Link,
  // ): Promise<void> {
  //   await this.linkRepository.replaceById(id, link);
  // }

  // @del('/links/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Link DELETE success',
  //     },
  //   },
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.linkRepository.deleteById(id);
  // }
}
