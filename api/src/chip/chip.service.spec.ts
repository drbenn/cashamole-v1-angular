import { Test, TestingModule } from '@nestjs/testing';
import { ChipService } from './chip.service';

describe('ChipService', () => {
  let service: ChipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChipService],
    }).compile();

    service = module.get<ChipService>(ChipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
