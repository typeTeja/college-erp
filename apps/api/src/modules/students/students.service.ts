import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        // Basic creation logic, would typically involve a DTO
        return this.prisma.student.create({
            data,
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: any;
        where?: any;
        orderBy?: any;
    }) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.student.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                user: true,
            },
        });
    }

    async findOne(id: number) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            include: {
                parents: true,
                documents: true,
                attendance: {
                    take: 5,
                    orderBy: { date: 'desc' },
                },
            },
        });
        if (!student) throw new NotFoundException(`Student with ID ${id} not found`);
        return student;
    }

    async update(id: number, data: any) {
        return this.prisma.student.update({
            where: { id },
            data,
        });
    }
}
