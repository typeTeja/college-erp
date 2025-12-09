import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
    @IsString()
    @IsNotEmpty()
    applicantName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    mobile!: string;

    @IsString()
    courseApplied!: string;
}
