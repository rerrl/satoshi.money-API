import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { PaginationCoinsDto } from './dto/coins.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/healthz')
  async getHealthz(): Promise<string> {
    return this.appService.healthCheck();
  }

  @Get('/coins')
  async getCoins(@Query() query: PaginationCoinsDto): Promise<any> {
    return this.appService.getCoins(query);
  }
}
