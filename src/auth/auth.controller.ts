import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  
  @Post('local/signup')
  signupLocal() {
    return { message: 'signup' }
  };

  @Post('local/signin')
  signinLocal() {
    return { message: 'signin' }
  };

  @Post('logout')
  logout() {
    return { message: 'logout' }
  };

  @Post('refresh')
  refreshTokens() {
    return { message: 'refresh' }
  };
};
