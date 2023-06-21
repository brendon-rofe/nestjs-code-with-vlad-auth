import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {};

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashPassword(dto.password);

    const newUser = this.prisma.user.create({
      data: {
        email: dto.email,
        hash: hash
      },
    });

    
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
