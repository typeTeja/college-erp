import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AdmissionsService } from './admissions.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('admissions')
@Controller('admissions')
export class AdmissionsController {
    constructor(private readonly admissionsService: AdmissionsService) { }

    @Post('apply')
    @ApiOperation({ summary: 'Submit a new admission application' })
    async apply(@Body() createApplicationDto: CreateApplicationDto) {
        return this.admissionsService.createApplication(createApplicationDto);
    }

    @Get('upload-url/:id/:type')
    @ApiOperation({ summary: 'Get presigned URL for document upload' })
    async getUploadUrl(
        @Param('id') id: string,
        @Param('type') type: string,
    ) {
        return this.admissionsService.getUploadUrl(+id, type);
    }
}
