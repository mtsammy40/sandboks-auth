import { Inject, Injectable, Logger } from "@nestjs/common";
import { PlatformEvents } from "./commons/platform-events.enum";
import { ClientKafka } from "@nestjs/microservices";
import { EventBasedDto } from "./commons/dto/EventBasedDto";
import { BehaviorSubject, filter, firstValueFrom, timeout } from "rxjs";
import { EventBus } from "./commons/event-bus.enum";

@Injectable()
export class AppService {

  private _responseEvents: BehaviorSubject<EventBasedDto> = new BehaviorSubject<EventBasedDto>(null);

  constructor(private readonly logger: Logger, @Inject('KAFKA') private _client: ClientKafka) {
  }

  onResponse(data: EventBasedDto) {
    this.logger.log('On response ' + JSON.stringify(data), 'AppService');
    this._responseEvents.next(data);
  }

  async route(request: {url: string; body: any}): Promise<any> {
    let requestDto = new EventBasedDto(await this.generateEventFromUrl(request.url), request.body);
    try {
      await this._client.emit<any>(
        EventBus.MAIN,
        JSON.stringify(requestDto)
      );
    } catch (e) {
      this.logger.error("Error creating project - request was unsuccessful", e);
    }

    try {
      let responseDto = await firstValueFrom(this._responseEvents
        .pipe(
          filter((response) => {
            return response._rid === requestDto._rid;
          }),
          timeout(30000)
        ));
      return responseDto.data;
    } catch (e) {
      this.logger.error("Error creating project - invalid or missing response", e);
    }
  }

  async generateEventFromUrl(url: string): Promise<PlatformEvents> {
    this.logger.log('Url -> ', url);
    return PlatformEvents.PROJECT_INITIALIZED;
  }
}
