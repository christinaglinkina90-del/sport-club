import { Injectable } from '@nestjs/common';
import { NewsSaveDto } from '../dto/news.save-dto';
import { NewsUpdateDto } from '../dto/news.update-dto';

@Injectable()
export class NewsValidator {
  validateSaveDto(saveDto: NewsSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    const title: string = saveDto.title.trim();
    if (!title || title.length < 2 || title.length > 100) {
      throw Error();
    }

    const content: string = saveDto.content.trim();
    if (!content || content.length < 2 || content.length > 1000) {
      throw Error();
    }
  }

  validateUpdateDto(updateDto: NewsUpdateDto): void {
    if (!updateDto) {
      throw Error();
    }

    if (!updateDto.newTitle && !updateDto.newContent) {
      throw Error();
    }
  }
}
