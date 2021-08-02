import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Feedback } from "./entities/feedback.entity";
import { Feedbacks } from "./models/feedback.model";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedbacks) private feedbacksModel: typeof Feedbacks,
  ) {}

  async findAll(customerId: string): Promise<Feedback[]> {
    const query = await this.feedbacksModel.findAll({
      where: { customer_id: customerId },
    });
    return query.map((feedback) => {
      return {
        ...feedback.get({ plain: true }),
        is_unread: false,
      };
    });
  }

  async findOne(id: string, customerId: string): Promise<Feedback> {
    const feedback = await this.feedbacksModel.findOne({
      where: { id, customer_id: customerId },
    });
    return {
      ...feedback.get({ plain: true }),
      is_unread: false,
    };
  }

  getUnreadCount(): number {
    return 0;
  }
}
