import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: []
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("app controller", () => {
    it("should be defined", function() {
      expect(appController).toBeDefined();
    });
  })
});
