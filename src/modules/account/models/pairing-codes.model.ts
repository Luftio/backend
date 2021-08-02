import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

@Table({
  createdAt: false,
  updatedAt: false,
})
export class PairingCodes extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, field: "entity_id" })
  id: string;

  @Column({ type: DataType.STRING, field: "str_v" })
  value: string;
}
