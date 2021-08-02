import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

@Table
export class Suggestions extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    field: "id",
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    field: "customer_id",
  })
  customer_id: string;

  @Column({ type: DataType.STRING, field: "title" })
  title: string;

  @Column({ type: DataType.STRING, field: "description" })
  description: string;

  @Column({ type: DataType.STRING, field: "how_solve" })
  how_solve: string;

  @Column({ type: DataType.STRING, field: "why_important" })
  why_important: string;

  @Column({ type: DataType.INTEGER, field: "importance" })
  importance: number;

  @Column({ type: DataType.DATE, field: "date", defaultValue: DataType.NOW })
  date: Date;
}
