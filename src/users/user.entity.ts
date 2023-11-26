import * as bcrypt from 'bcrypt';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from 'src/reports/report.entity';
import { Role } from 'src/common/interfaces/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword(): Promise<void> {
    if (this.tempPassword !== this.password) {
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    }
  }
}
