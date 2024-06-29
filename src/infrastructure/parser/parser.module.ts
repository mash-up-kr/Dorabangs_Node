import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';

@Module({
  providers: [ParserService]
})
export class ParserModule {}
