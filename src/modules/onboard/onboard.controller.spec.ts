import { Test, TestingModule } from '@nestjs/testing';
import { OnboardController } from './onboard.controller';

describe('OnboardController', () => {
  let controller: OnboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardController],
    }).compile();

    controller = module.get<OnboardController>(OnboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
