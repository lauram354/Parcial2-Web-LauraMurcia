import { Test, TestingModule } from '@nestjs/testing';
import { ReseniaService } from './resenia.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReseniaEntity } from './resenia.entity/resenia.entity';

describe('ReseniaService', () => {
  let service: ReseniaService;
  let repository: Repository<ReseniaEntity>;
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReseniaService],
    }).compile();

    service = module.get<ReseniaService>(ReseniaService);
    repository = module.get<Repository<ReseniaEntity>>(getRepositoryToken(ReseniaEntity));
    
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
