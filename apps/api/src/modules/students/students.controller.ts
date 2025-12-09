import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('students')
@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new student' })
    async create(@Body() createStudentDto: any) {
        return this.studentsService.create(createStudentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all students with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    async findAll(@Query('page') page = 1) {
        const take = 10;
        const skip = (page - 1) * take;
        return this.studentsService.findAll({ skip, take });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get student details by ID' })
    async findOne(@Param('id') id: string) {
        return this.studentsService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update student details' })
    async update(@Param('id') id: string, @Body() updateStudentDto: any) {
        return this.studentsService.update(+id, updateStudentDto);
    }
}
