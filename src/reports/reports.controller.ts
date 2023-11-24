import { Controller, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/v1/reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }
}
