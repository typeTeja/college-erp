import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password!: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: 'ADMIN' })
    @IsString()
    @IsNotEmpty()
    roleName!: string; // Using string to lookup Role table
}
