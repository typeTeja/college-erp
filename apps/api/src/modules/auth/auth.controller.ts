import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Register a new user (Admin only)' })
    @ApiResponse({ status: 201, description: 'User successfully created.' })
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @ApiOperation({ summary: 'Login with Email and Password' })
    @ApiResponse({ status: 200, description: 'Login successful.' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @ApiOperation({ summary: 'Logout' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: any) { // Typed as any for now to access user
        return this.authService.logout(req.user['sub']);
    }

    @ApiOperation({ summary: 'Refresh Access Token' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@Req() req: any) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
