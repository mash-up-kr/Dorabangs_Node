import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('onboards')
export class OnboardCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string;
}
