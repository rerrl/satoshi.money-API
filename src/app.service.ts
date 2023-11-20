import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const COINGECKO_API_URL = process.env.COINGECKO_API_URL;
const prisma = new PrismaClient();

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit(): void {
    // if not testing with jest:
    if (process.env.NODE_ENV !== 'test') {
      this.updateCoins();
    }
  }

  async healthCheck(): Promise<string> {
    console.log('Health check...');
    const resp = await axios.get(`${COINGECKO_API_URL}/ping`);
    if (resp.status !== 200) {
      throw new Error('Error');
    }
    return 'OK';
  }

  @Cron(`*/${process.env.UPDATE_COIN_CRON_INTERVAL_S} * * * * *`, {
    disabled: process.env.NODE_ENV === 'test',
  })
  async updateCoins(): Promise<void> {
    try {
      console.log('Updating coins...');
      const coins = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
          locale: 'en',
        },
      });
      for (const coin in coins.data) {
        await prisma.coins.upsert({
          where: { cg_id: coins.data[coin].id },
          update: {
            current_price: coins.data[coin].current_price,
            market_cap: coins.data[coin].market_cap,
            high_24h: coins.data[coin].high_24h,
            low_24h: coins.data[coin].low_24h,
            ath: coins.data[coin].ath,
          },
          create: {
            cg_id: coins.data[coin].id,
            symbol: coins.data[coin].symbol,
            name: coins.data[coin].name,
            current_price: coins.data[coin].current_price,
            market_cap: coins.data[coin].market_cap,
            mc_rank: coins.data[coin].market_cap_rank,
            high_24h: coins.data[coin].high_24h,
            low_24h: coins.data[coin].low_24h,
            ath: coins.data[coin].ath,
            volume_24h: coins.data[coin].total_volume,
            last_updated: coins.data[coin].last_updated,
          },
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      console.log('Done updating coins.');
      await prisma.$disconnect();
    }
  }
}
