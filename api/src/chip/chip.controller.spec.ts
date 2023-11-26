import { Test, TestingModule } from '@nestjs/testing';
import { ChipController } from './chip.controller';

describe('ChipController', () => {
  let controller: ChipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChipController],
    }).compile();

    controller = module.get<ChipController>(ChipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
