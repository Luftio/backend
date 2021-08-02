import { Module } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { FeedbackResolver } from "./feedback.resolver";
import { SequelizeModule } from "@nestjs/sequelize";
import { Feedbacks } from "./models/feedback.model";

@Module({
  imports: [SequelizeModule.forFeature([Feedbacks])],
  providers: [FeedbackResolver, FeedbackService],
})
export class FeedbackModule {}
