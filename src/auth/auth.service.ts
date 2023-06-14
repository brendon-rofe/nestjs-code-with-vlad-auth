import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as users from '../users.json';
import { AuthDto } from './dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {};

  signinLocal(dto: AuthDto) {
    const user = users.find(user => user.email === dto.email);
    if(!user) throw new UnauthorizedException('Credentials incorrect');
    if(user.password !== dto.password) throw new UnauthorizedException('Credentials incorrect');
    return { jwt: this.signUser(user.id, user.email, 'user') };
  };

  signupLocal(dto: AuthDto) {

  };

  signUser(userId: number, email: string, type: string) {
    return this.jwtService.sign({
      sub: userId,
      email: email,
      type: type
    })
  };

};
