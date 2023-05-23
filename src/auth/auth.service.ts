import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {};

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  };

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashPassword(dto.password);
    const newUser = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hash
      }
    });
    newUser.hash = undefined;
    return;
  };

  signinLocal() {};

  logout() {};

  refreshTokens() {};

}
