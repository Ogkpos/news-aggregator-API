import request from "supertest";
import { app } from "../../app";

it("Fails when an email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(400);
});

it("Responds with an OTP code  when given valid credentials", async () => {
  await request(app)
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
    })
    .expect(200);
  expect(response.body.data.otp).toBeDefined();
  // console.log(response.body);

  // expect(response.get("Set-Cookie")).toBeDefined();
});
