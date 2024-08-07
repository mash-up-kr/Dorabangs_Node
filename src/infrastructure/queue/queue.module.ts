import { ClassProvider, Module } from '@nestjs/common';
import { SQSService } from './sqs.service';

const providers: ClassProvider[] = [
  {
    provide: 'IQeueuService',
    useClass: SQSService,
  },
];
@Module({
  providers,
  exports: providers,
})
export class QueueModule {}
