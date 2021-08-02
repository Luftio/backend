import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

@Table
export class EventsFromMeasure extends Model {
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

  @Column({ type: DataType.STRING, field: "place" })
  place: string;

  @Column({ type: DataType.STRING, field: "justification" })
  justification: string;

  @Column({ type: DataType.DATE, field: "date", defaultValue: DataType.NOW })
  date: Date;

  @Column({ type: DataType.INTEGER, field: "threat" })
  threat: number;
}
