import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { Role } from 'src/common/interfaces/roles.enum';
import { Auth } from 'src/common/decorators/auth.decorator';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Controller('api/v1/reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get()
  getEstimate(@Query() getEstimateDto: GetEstimateDto) {
    return getEstimateDto;
    // return this.reportService.getEstimate(getEstimateDto);
  }

  @Post()
  @Serialize(ReportDto)
  @UseGuards(AuthGuard)
  create(@Body() createReportDto: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(createReportDto, user);
  }

  @Patch('/:id')
  @Auth(Role.Admin)
  @Serialize(ReportDto)
  update(@Param('id') id: number, @Body() approveReportDto: ApproveReportDto, @CurrentUser() user: User) {
    console.log(user);
    return this.reportService.update(id, approveReportDto);
  }
}
