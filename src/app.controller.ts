import { All, Body, Controller, Request, Req, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { EventPattern } from "@nestjs/microservices";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { EventBus } from "./commons/event-bus.enum";

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All()
  @UseGuards(JwtAuthGuard)
  public async route(
    @Req() request: Request,
    @Body() requestBody: any
  ): Promise<any> {
    return this.appService
      .route({url: request.url, body: requestBody})
      .then(serviceResponse => {
        return serviceResponse;
      });
  }

  @EventPattern(EventBus.MAIN)
  async projectCreated(project: any) {
    this.appService.onResponse(project);
  }
}
