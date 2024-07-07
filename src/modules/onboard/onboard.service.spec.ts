import { Test, TestingModule } from '@nestjs/testing';
import { OnboardService } from './onboard.service';

describe('OnboardService', () => {
  let service: OnboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnboardService],
    }).compile();

    service = module.get<OnboardService>(OnboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
