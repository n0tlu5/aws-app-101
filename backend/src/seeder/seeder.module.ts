import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
