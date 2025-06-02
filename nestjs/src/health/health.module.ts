import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HealthResolver } from './health.resolver';

@Module({
  controllers: [HealthController],
  providers: [HealthService, HealthResolver],
  exports: [HealthService],
})
export class HealthModule {}