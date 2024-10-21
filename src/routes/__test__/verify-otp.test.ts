import request from "supertest";
import { app } from "../../app"; // Assuming the `app` is exported from your main file
import { User } from "../../models/user";

it("creates a user, generates OTP on signin, and verifies the OTP to log the user in", async () => {
  // Step 1: Sign up the user
  const signupResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test1234",
      username: "Ogkpos",
      interests: ["Fashion", "Religion"],
    })
    .expect(201);

  expect(signupResponse.body.user.email).toEqual("test@test.com");

  // Step 2: Sign in the user to get OTP
  const signinResponse = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(200);

  // Extract the OTP from the response
  const otp = signinResponse.body.data.otp;
  expect(otp).toBeDefined(); // Ensure OTP was generated and sent back

  // Step 3: Verify OTP to complete login
  const verifyOtpResponse = await request(app)
    .post("/api/users/verifyotp")
    .send({
      email: "test@test.com",
      otp: otp, // Use the OTP received in the signin step
    })
    .expect(200);

  // Validate the final login response
  expect(verifyOtpResponse.body.message).toEqual("Login successful");
  expect(verifyOtpResponse.body.user.email).toEqual("test@test.com");

  // Optional: Check if session token or JWT is set in the response (if applicable)
  expect(verifyOtpResponse.get("Set-Cookie")).toBeDefined();
});
