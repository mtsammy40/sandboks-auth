import { v4 as uuid } from "uuid";
import { PlatformEvents } from "../platform-events.enum";

export class EventBasedDto {
  _rid: any;
  _event: PlatformEvents;
  data: any;

  constructor(event: PlatformEvents, data: any) {
    this._rid = uuid()
    this.data = data;
  }
}
