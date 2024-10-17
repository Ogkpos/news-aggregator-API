import request from "supertest";
import { app } from "../../app";

jest.setTimeout(30000); // 30 seconds

it("returns 201 on successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      username: "ogkpos",
      email: "test@test.com",
      password: "test1234",
      interests: ["Technology", "Finance"],
    })
    .expect(201);
});

it("returns 400 if you provide invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@",
    })
    .expect(400);
});

it("returns 400 if you provide invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "t",
    })
    .expect(400);
});

it("ensures interests is an array of strings", async () => {
  const response = await request(app).post("/api/users/signup").send({
    interests: "Technology",
  });

  expect(Array.isArray(response.body.interests)).toBe(false);
});

it("Sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      username: "ogkpos",
      email: "test@test.com",
      password: "test1234",
      interests: ["Technology", "Fashion"],
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
