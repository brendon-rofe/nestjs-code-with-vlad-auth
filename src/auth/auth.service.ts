import { Injectable, UnauthorizedException } from '@nestjs/common';
const users = require('../users.json');
import { AuthDto } from './dtos';

@Injectable()
export class AuthService {

  signinLocal(dto: AuthDto) {
    const user = users.find(user => user.email === dto.email);
    if(!user) throw new UnauthorizedException('Credentials incorrect');
    if(user.password !== dto.password) throw new UnauthorizedException('Credentials incorrect');
    return user;
  };

  signupLocal(dto: AuthDto) {

  };

};
