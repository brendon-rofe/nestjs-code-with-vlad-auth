import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signupLocal() {
    return { message: 'signup' }
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
