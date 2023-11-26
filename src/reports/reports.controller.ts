import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/users/decorators/serialize.decorator';
import { ReportDto } from './dto/report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/interfaces/roles.enum';

@Controller('api/v1/reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Post()
  @Serialize(ReportDto)
  @UseGuards(AuthGuard)
  create(@Body() createReportDto: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(createReportDto, user);
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @Serialize(ReportDto)
  update(@Param('id') id: number, @Body() approveReportDto: ApproveReportDto) {
    return this.reportService.update(id, approveReportDto);
  }
}
