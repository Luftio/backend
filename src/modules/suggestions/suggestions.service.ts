import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Suggestion } from "./entities/suggestion.entity";
import { Suggestions } from "./models/suggestions.model";

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectModel(Suggestions) private suggestionsModel: typeof Suggestions,
  ) {}

  async findAll(customerId: string): Promise<Suggestion[]> {
    const query = await this.suggestionsModel.findAll({
      where: { customer_id: customerId },
    });
    return query.map((suggestion) => {
      console.log(suggestion.get({ plain: true }));
      return {
        ...suggestion.get({ plain: true }),
        is_unread: false,
      };
    });
  }

  async findOne(id: string, customerId: string): Promise<Suggestion> {
    const suggestion = await this.suggestionsModel.findOne({
      where: { id, customer_id: customerId },
    });
    return {
      ...suggestion.get({ plain: true }),
      is_unread: false,
    };
  }

  getUnreadCount(): number {
    return 0;
  }
}
