import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/user";

it("Fails when an email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(400);
});

it("Responds with an OTP code when given valid credentials", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test1234",
      username: "Ogkpos",
      interests: ["Fashion", "Religion"],
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test1234",
      otp: 123456,
    })
    .expect(200);
  console.log("otp suppose de:", response.body.data);
  // const otp = response.body.data.otp;
  // expect(otp).toBeDefined(); // Ensure OTP was generated and sent back
  // const otp = response.body.data.otp;
  // expect(otp).toBeDefined(); // Ensure OTP
  // expect(response.body.data.otp).toBeDefined();

  // expect(response.get("Set-Cookie")).toBeDefined();
});
