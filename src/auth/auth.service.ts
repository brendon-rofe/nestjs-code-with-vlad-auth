import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) {};

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  };

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7
        }
      ),
    ])
    return {
      access_token: at,
      refresh_token: rt
    }
  };

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashPassword(dto.password);
    const newUser = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hash
      }
    });
    const tokens = await this.getTokens(newUser.id, newUser.email);
    return tokens;
  };

  async updateRtHash() {
    
  };

  signinLocal() {};

  logout() {};

  refreshTokens() {};

}
