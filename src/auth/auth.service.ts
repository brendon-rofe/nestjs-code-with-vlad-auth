import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {};

  signupLocal(dto: AuthDto) {
    
  };

  signinLocal() {
    return { message: 'signin' }
  };

  logout() {
    return { message: 'logout' }
  };

  refreshTokens() {
    return { message: 'refresh' }
  };
};
