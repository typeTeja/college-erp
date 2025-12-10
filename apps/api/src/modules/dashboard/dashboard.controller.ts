import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../common/prisma.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private prisma: PrismaService) { }

  @Get('stats')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    const [
      totalStudents,
      totalFaculty,
      pendingAdmissions,
      activeStudents,
    ] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.faculty.count(),
      this.prisma.admissionApplication.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.student.count({
        where: { status: 'ACTIVE' },
      }),
    ]);

    return {
      totalStudents,
      totalFaculty,
      pendingAdmissions,
      activeStudents,
    };
  }

  @Get('recent-admissions')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get recent admission applications' })
  async getRecentAdmissions() {
    return this.prisma.admissionApplication.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        course: true,
      },
    });
  }
}
