import { Injectable } from '@nestjs/common';
import { UserSaveDto } from '../dto/user.save-dto';
import { UserUpdateDto } from '../dto/user.update-dto';

@Injectable()
export class UsersValidator {
  validateSaveDto( saveDto: UserSaveDto): void {
    if (!saveDto) {
      throw Error
    }

    const email: string = saveDto.email.trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
      throw Error ();
    }
    const password: string = saveDto.password.trim();
    if (!password || password.length < 8 || password.length > 20) {
      throw Error ();
    }
    const name: string = saveDto.name.trim();
    if (!name || name.length < 2 || name.length > 30 ) {
      throw Error ();
    }
    const phone: string = saveDto.phone.trim();
    if (!phone || phone.length < 2 || phone.length > 30 ) {
      throw Error();
    }
  }
  validateUpdateDto(upDateDto: UserUpdateDto): void {
    if (!upDateDto) {
      throw Error()
    }
    const name: string = upDateDto.newName.trim();
    if (!name || name.length < 2 || name.length > 30 ) {
      throw Error ();
    }

  }
}