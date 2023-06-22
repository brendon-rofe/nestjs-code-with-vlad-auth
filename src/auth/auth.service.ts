import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {};

  hashData(password: string) {
    return bcrypt.hash(password, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId,
        email: email
      }, {
        secret: 'at-secret',
        expiresIn: 60 * 15,
      }),
      this.jwtService.signAsync({
        sub: userId,
        email: email
      }, {
        secret: 'rt-secret',
        expiresIn: 60 * 60 * 24 * 7,
      })
    ]);

    return {
      access_token: at,
      refresh_token: rt
    }
  };

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash: hash
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  };

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);

    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        hashedRt: hash,
      }
    })
  };

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    if(!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(dto.password, (await user).hash);
    if(!passwordMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens((await user).id, (await user).email);
    await this.updateRtHash((await user).id, tokens.refresh_token);
    return tokens;    
  };

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null
        }
      },
      data: {
        hashedRt: null
      }
    })
  };

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    if(!user) throw new ForbiddenException('Access denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if(!rtMatches) throw new ForbiddenException('Access denied');
    const tokens = await this.getTokens((await user).id, (await user).email);
    await this.updateRtHash((await user).id, tokens.refresh_token);
    return tokens;
  };
};
