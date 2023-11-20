import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const CRON_INTERVAL_S = 5;

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit(): void {
    this.updateCoins();
  }

  async healthCheck(): Promise<string> {
    const resp = await axios.get(`${COINGECKO_API_URL}/ping`);
    if (resp.status !== 200) {
      throw new Error('Error');
    }
    return 'OK';
  }

  @Cron(`*/${CRON_INTERVAL_S} * * * * *`)
  async updateCoins(): Promise<void> {
    console.log('Updating coins');
  }
}
