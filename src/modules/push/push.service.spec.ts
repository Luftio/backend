import { Test, TestingModule } from "@nestjs/testing";
import { PushService } from "./push.service";

describe("PushService", () => {
  let service: PushService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PushService],
    }).compile();

    service = module.get<PushService>(PushService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create", async () => {
    expect(await service.insertToken("a", "b")).toBeDefined();
  });

  it("should get", async () => {
    expect(await service.getTokens("a")).toBeDefined();
  });

  it("should delete", async () => {
    expect(await service.deleteToken("a", "b")).toBeDefined();
  });
});
