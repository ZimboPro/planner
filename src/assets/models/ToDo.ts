import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ToDo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ type: 'date' })
  dueDate: Date;
  @Column()
  completed: boolean;
}
