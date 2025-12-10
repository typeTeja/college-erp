import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [JwtModule.register({}), PassportModule], // Register empty as we use strategies
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
    exports: [AuthService], // Export service for other modules
})
export class AuthModule { }
