import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';

interface UserRoleWithRole {
    role: { name: string };
}

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    /**
     * Register a new user (Admin only or system process)
     */
    async register(dto: RegisterDto) {
        // Check if user exists
        const userExists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (userExists) throw new BadRequestException('User already exists');

        // Hash password
        const hash = await this.hashData(dto.password);

        // Find Role
        const role = await this.prisma.role.findUnique({
            where: { name: dto.roleName },
        });
        if (!role) throw new BadRequestException('Role not found');

        // Create User and Assign Role
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                phone: dto.phone,
                password: hash,
                roles: {
                    create: {
                        roleId: role.id,
                    },
                },
            },
            include: { roles: { include: { role: true } } },
        });

        const tokens = await this.getTokens(newUser.id, newUser.email, newUser.roles.map((r: UserRoleWithRole) => r.role.name));
        await this.updateRefreshToken(newUser.id, tokens.refresh_token);

        return tokens;
    }

    /**
     * Login with Email and Password
     */
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { roles: { include: { role: true } } },
        });

        if (!user || !user.isActive) throw new ForbiddenException('Access Denied');

        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email, user.roles.map((r: UserRoleWithRole) => r.role.name));
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return {
            user: { id: user.id, email: user.email, roles: user.roles.map((r: UserRoleWithRole) => r.role.name) },
            ...tokens
        };
    }

    /**
     * Logout (Revoke Refresh Token)
     */
    async logout(userId: number) {
        // In a real multi-device scenario, you might delete just the matching token.
        // For simplicity, we can delete all or specific ones. 
        // Here we will delete all for the user for now to force clean state, 
        // or arguably just the one derived from the request is better. 
        // Let's implement full revoke for simplicity first.
        await this.prisma.refreshToken.deleteMany({
            where: { userId, isRevoked: false },
        });
        return true;
    }

    /**
     * Refresh Tokens
     */
    async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: true } } },
        });
        if (!user || !user.isActive) throw new ForbiddenException('Access Denied');

        // Check DB for matching RT
        // Note: We should hash the incoming RT and compare with stored hash
        // simplified for demonstration: verify one of the stored tokens matches
        // In production: find the specific token entry by hash(rt)

        // For now assuming we just validate standard flow. 
        // Correct way: 
        // 1. Hash incoming RT
        // 2. Find in DB
        // 3. If found and not revoked, proceed.

        // For this implementation, we will skip DB strict check to save complexity 
        // unless strictly requested. The prompt asked for "Store refresh token hashed in DB".

        const rtHash = await this.hashData(rt);
        const tokenRecord = await this.prisma.refreshToken.findFirst({
            where: { userId, tokenHash: rtHash, isRevoked: false }
        });

        if (!tokenRecord) throw new ForbiddenException('Access Denied - Invalid Token');

        // Check expiry
        if (tokenRecord.expiresAt < new Date()) {
            await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
            throw new ForbiddenException('Access Denied - Expired');
        }

        const tokens = await this.getTokens(user.id, user.email, user.roles.map((r: UserRoleWithRole) => r.role.name));
        await this.updateRefreshToken(user.id, tokens.refresh_token); // Rotate

        // Revoke old one
        await this.prisma.refreshToken.update({
            where: { id: tokenRecord.id },
            data: { isRevoked: true }
        });

        return tokens;
    }

    // --- Helpers ---

    async hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: number, email: string, roles: string[]) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    roles,
                },
                {
                    secret: this.config.get<string>('JWT_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    roles,
                },
                {
                    secret: this.config.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async updateRefreshToken(userId: number, rt: string) {
        const hash = await this.hashData(rt);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        await this.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash: hash,
                expiresAt: expiryDate,
            },
        });
    }
}

