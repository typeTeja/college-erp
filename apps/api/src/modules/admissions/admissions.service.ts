import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { StorageService } from '../../common/storage.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class AdmissionsService {
    constructor(
        private prisma: PrismaService,
        private storage: StorageService,
    ) { }

    async createApplication(data: CreateApplicationDto) {
        // Note: In real app, you'd look up courseId etc.
        // For now assuming courseId=1 exists or validation happens elsewhere
        return this.prisma.admissionApplication.create({
            data: {
                fullName: data.applicantName, // mapped from DTO
                email: data.email,
                phone: data.mobile,
                dob: new Date(), // Mock DOB, should be in DTO
                course: {
                    connect: { id: 1 }, // Mock course ID
                },
                status: 'PENDING',
            },
        });
    }

    async getUploadUrl(applicationId: number, fileType: string) {
        const app = await this.prisma.admissionApplication.findUnique({
            where: { id: applicationId },
        });
        if (!app) throw new BadRequestException('Application not found');

        const key = `admissions/${app.applicationNo}/${fileType}-${Date.now()}`;
        const url = await this.storage.getPresignedUploadUrl(key, 'application/pdf'); // Simplified
        return { url, key };
    }
}
