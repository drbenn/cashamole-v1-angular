import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';


@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
            session: false
        }),
        JwtModule.register({
          secret: 'secretKey43',
          signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [JwtStrategy, AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
