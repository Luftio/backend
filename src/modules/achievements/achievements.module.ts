import { Module } from "@nestjs/common";
import { AchievementsService } from "./achievements.service";
import { AchievementsResolver } from "./achievements.resolver";
import { SequelizeModule } from "@nestjs/sequelize";
import { Achievements } from "./models/achievements.model";

@Module({
  imports: [SequelizeModule.forFeature([Achievements])],
  providers: [AchievementsResolver, AchievementsService],
})
export class AchievementsModule {}
