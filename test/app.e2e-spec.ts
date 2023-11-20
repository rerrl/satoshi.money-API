import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/healthz', () => {
    return request(app.getHttpServer())
      .get('/healthz')
      .expect(200)
      .expect('OK');
  });

  describe('GET /coins', () => {
    let coins = [];

    it('no query params passed', async () => {
      const resp = await request(app.getHttpServer()).get('/coins').expect(200);
      expect(resp.body).toHaveProperty('coins');
      expect(resp.body).toHaveProperty('total');
      expect(resp.body.coins).toHaveLength(10);
      expect(resp.body.total).toBe(10);
      coins = resp.body.coins;
    });

    it('pagination should work', async () => {
      const resp = await request(app.getHttpServer())
        .get('/coins')
        .query({
          offset: 2,
          limit: 5,
        })
        .expect(200);
      expect(resp.body).toHaveProperty('coins');
      expect(resp.body).toHaveProperty('total');
      expect(resp.body.coins).toHaveLength(5);
      expect(resp.body.total).toBe(5);

      // make sure the coins are the second half of the coins from the first request
      expect(resp.body.coins).toEqual(coins.slice(5));
    });

    it("should sort by 'current_price' in 'asc' order", async () => {
      const resp = await request(app.getHttpServer())
        .get('/coins')
        .query({
          order: 'asc',
          orderBy: 'current_price',
        })
        .expect(200);
      expect(resp.body).toHaveProperty('coins');
      expect(resp.body).toHaveProperty('total');
      expect(resp.body.coins).toHaveLength(10);
      expect(resp.body.total).toBe(10);

      // make sure the coins are in ascending order
      const prices = resp.body.coins.map((coin) => coin.current_price);
      expect(prices).toEqual(prices.sort((a, b) => a - b));
    });

    it('Cached response should be faster', async () => {
      const start = Date.now();
      const resp = await request(app.getHttpServer()).get('/coins').expect(200);
      const firstRequestTime = Date.now() - start;
      expect(resp.body).toHaveProperty('coins');
      expect(resp.body).toHaveProperty('total');
      expect(resp.body.coins).toHaveLength(10);
      expect(resp.body.total).toBe(10);

      const start2 = Date.now();
      const resp2 = await request(app.getHttpServer())
        .get('/coins')
        .expect(200);
      const secondRequestTime = Date.now() - start2;
      expect(resp2.body).toHaveProperty('coins');
      expect(resp2.body).toHaveProperty('total');
      expect(resp2.body.coins).toHaveLength(10);
      expect(resp2.body.total).toBe(10);

      // make sure the second request is faster
      console.log({ firstRequestTime, secondRequestTime });
      expect(secondRequestTime).toBeLessThan(firstRequestTime);
    });
  });
});
