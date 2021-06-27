import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { TeamsModule } from './teams/teams.module';
import { TeamsController } from './teams/teams.controller';
import { TeamsService } from './teams/teams.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

export { TeamsModule, TeamsController, TeamsService };