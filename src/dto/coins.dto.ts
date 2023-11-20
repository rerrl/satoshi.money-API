import { IsOptional, IsPositive } from 'class-validator';

export class PaginationCoinsDto {
  @IsOptional()
  @IsPositive()
  offset?: number;

  @IsOptional()
  @IsPositive()
  limit?: number;

  @IsOptional()
  order?: 'asc' | 'desc';

  @IsOptional()
  orderBy?:
    | 'current_price'
    | 'market_cap'
    | 'mc_rank'
    | 'high_24h'
    | 'low_24h'
    | 'ath';
}
