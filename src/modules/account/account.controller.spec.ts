import { Test, TestingModule } from "@nestjs/testing";
import { AccountController } from "./account.controller";
import { ThingsboardService } from "../thingsboard/thingsboard.service";

describe("AccountController", () => {
  let controller: AccountController;
  let thingsboardService: ThingsboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    thingsboardService = module.get<ThingsboardService>(ThingsboardService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {
    it("should register a valid user", async () => {
      const body = {
        name: "Test User",
        email: "test.user@example.com",
        password: "s@feP4ssw0rd",
      };
      const result = Promise.resolve({
        status: 200,
        statusText: "",
        headers: {},
        config: {},
        data: {
          id: { entityType: "USER", id: "..." },
        },
      });
      jest
        .spyOn(thingsboardService, "createUser")
        .mockImplementation(() => result);
      expect(await controller.register(body)).toBe(result);
    });
  });
});
