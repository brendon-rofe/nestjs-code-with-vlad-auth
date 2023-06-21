import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {};

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async signupLocal(dto: AuthDto) {
    const hash = await this.hashPassword(dto.password);

    const newUser = this.prisma.user.create({
      data: {
        email: dto.email,
        hash: hash
      },
    });
    (await newUser).hash = undefined;
    return newUser;
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
