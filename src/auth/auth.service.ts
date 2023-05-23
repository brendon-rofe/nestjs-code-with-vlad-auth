import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {};

  async signupLocal(dto: AuthDto) {
    const newUser = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hash: dto.password
      }
    });
  };

  signinLocal() {};

  logout() {};

  refreshTokens() {};

}
