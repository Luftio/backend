import { Module } from "@nestjs/common";
import { SuggestionsService } from "./suggestions.service";
import { SuggestionsResolver } from "./suggestions.resolver";
import { Suggestions } from "./models/suggestions.model";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [SequelizeModule.forFeature([Suggestions])],
  providers: [SuggestionsResolver, SuggestionsService],
})
export class SuggestionsModule {}
