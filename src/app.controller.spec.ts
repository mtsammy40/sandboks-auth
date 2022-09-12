import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Logger } from "@nestjs/common";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";
import { microserviceTestConfig } from "./microservice.test.config";

describe("AppController", () => {
  let appController: AppController;
  let _kafkaClient: ClientKafka;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, Logger, ClientKafka],
      imports: [
        ClientsModule.register([
          { name: "KAFKA", options: microserviceTestConfig }
        ])]
    }).compile();

    appController = app.get<AppController>(AppController);
    _kafkaClient = app.get<ClientKafka>(ClientKafka);
  });

  describe("app controller", () => {
    it("should be defined", function() {
      expect(appController).toBeDefined();
    });
  });
});
