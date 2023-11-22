import { Controller, Get, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Get('login')
  async login(@Res({ passthrough: true }) res) {
    console.log('login hit');
    
    const payload = { username: 'john', id: 1 };
    console.log(this.jwtService.sign(payload));
    
    res.cookie('user_token', this.jwtService.sign(payload), {
      expires: new Date(Date.now() + 3600000),
    });
    return {};
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res) {
    console.log('logout hit');
    res.cookie('user_token', '', { expires: new Date(Date.now()) });
    return {};
  }
}