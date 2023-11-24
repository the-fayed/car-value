import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly reportsRepo: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const report = this.reportsRepo.create({
      price: createReportDto.price,
      make: createReportDto.make,
      model: createReportDto.model,
      year: createReportDto.year,
      lng: createReportDto.lng,
      lat: createReportDto.lat,
      mileage: createReportDto.mileage,
    });

    return await this.reportsRepo.save(report);
  }
}
