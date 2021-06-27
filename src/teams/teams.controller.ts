import { Controller, Get } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  @Get("list")
  getHello(): string {
    return this.teamService.getHello();
  }
}
