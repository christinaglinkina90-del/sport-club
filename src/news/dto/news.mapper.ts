import { Injectable } from '@nestjs/common';
import { News } from '../news.entity.js';
import { NewsDto } from './news.dto.js';
import { NewsSaveDto } from './news.save-dto.js';

@Injectable()
export class NewsMapper {

  mapDtoToEntity(saveDto: NewsSaveDto): News {
    const entity: News = new News();
    entity.title = saveDto.title;
    entity.content = saveDto.content;
    return entity;
  }

  mapEntityToDto(entity: News): NewsDto {
    const dto: NewsDto = new NewsDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.content = entity.content;
    // дату не показываем чтобы скрыть заранее запланированные новости
    return dto;
  }

  mapEntityListToDtoList(entityList: News[]): NewsDto[] {
    if (!entityList) {
      return [];
    }
    return entityList.map((x: News): NewsDto => this.mapEntityToDto(x));
  }
}
