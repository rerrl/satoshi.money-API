import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  async healthCheck(): Promise<string> {
    const resp = await axios.get('https://api.coingecko.com/api/v3/ping');
    if (resp.status !== 200) {
      throw new Error('Error');
    }
    return 'OK';
  }
}
