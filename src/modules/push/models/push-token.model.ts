import { Column, Index, Model, Table } from "sequelize-typescript";

@Table
export class PushToken extends Model {
  @Column
  @Index({
    name: "userid-token",
    unique: true,
  })
  userId: string;

  @Column
  @Index("userid-token")
  token: string;
}
