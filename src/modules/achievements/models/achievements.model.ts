import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

@Table
export class Achievements extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @Column({ type: DataType.UUID, field: "userid" })
  userid: string;

  @Column({ type: DataType.STRING, field: "name" })
  name: string;
}
