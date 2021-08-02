import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

@Table
export class Feedbacks extends Model {
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

  @Column({ type: DataType.STRING, field: "name" })
  name: string;

  @Column({ type: DataType.INTEGER, field: "total_score" })
  total_score: number;

  @Column({ type: DataType.DATE, field: "date" })
  date: Date;

  @Column({ type: DataType.INTEGER, field: "temperature" })
  temperature: number;

  @Column({ type: DataType.INTEGER, field: "breath" })
  breath: number;

  @Column({
    type: DataType.STRING,
    field: "how_feel",
    defaultValue: DataType.NOW,
  })
  how_feel: string;
}
