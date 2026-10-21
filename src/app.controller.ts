import { Controller, Get, Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { AppService } from './app.service.js';
import { DRIZZLE, type Db } from './db/db.module.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(DRIZZLE) private readonly db: Db,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async health() {
    await this.db.execute(sql`select 1`);
    return { db: 'ok' };
  }
  
}
