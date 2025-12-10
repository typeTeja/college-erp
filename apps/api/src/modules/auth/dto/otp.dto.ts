import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
    @ApiProperty({ example: '9876543210' })
    @IsString()
    @IsNotEmpty()
    @Length(10, 15)
    mobile!: string;
}

export class VerifyOtpDto {
    @ApiProperty({ example: '9876543210' })
    @IsString()
    @IsNotEmpty()
    @Length(10, 15)
    mobile!: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    code!: string;
}
