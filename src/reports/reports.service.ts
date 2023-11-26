import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly reportsRepo: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto, user: User): Promise<Report> {
    const report = this.reportsRepo.create(createReportDto);
    report.user = user;

    return await this.reportsRepo.save(report);
  }

  async update(id: number, attars: Partial<Report>): Promise<Report> {
    const report = await this.reportsRepo.findOne({ where: { id: id } });
    if (!report) {
      throw new NotFoundException(`No report with the id ${id} was found.`);
    }
    Object.assign(report, attars);
    return await this.reportsRepo.save(report);
  }
}
