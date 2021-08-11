import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Achievement } from "./entities/achievement.entity";
import { Achievements } from "./models/achievements.model";

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievements) private achievementsModel: typeof Achievements,
  ) {}

  async findMy(userId: string): Promise<Achievement[]> {
    console.log(userId);
    const achievements = await this.achievementsModel.findAll({
      where: { userid: userId },
    });
    return [...achievements];
  }
}
