const app = require("../server/app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seed");
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("general errors", () => {
  test("endpoints that do not exist will return 404 not found", () => {
    return request(app)
      .get("/invalidEndpoint")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Endpoint does not exist");
      });
  });
});
describe("users", () => {
  describe("POST user", () => {
    test("Post user will return 201 and the user details excluding the password", () => {
      return request(app)
        .post("/register")
        .send({
          forename: "James",
          surname: "Smith",
          email: "james.smith@example.com",
          password: "password123!",
        })
        .expect(201)
        .then(({ body }) => {
          const { user } = body;
          expect(user).toMatchObject({
            forename: "James",
            surname: "Smith",
            email: "james.smith@example.com",
          });
          expect(user.password == false).toBe(true);
        });
    });
    test("posting a duplicated email will return 409 email already exists", () => {
      return request(app)
        .post("/register")
        .send({
          forename: "Alice",
          surname: "Smith",
          email: "alice@example.com",
          password: "password123!",
        })
        .expect(409)
        .then(({ body }) => {
          expect(body.msg).toBe("Email already exists");
        });
    });
    describe("posting with missing infomation", () => {
      test("missing forename", () => {
        return request(app)
          .post("/register")
          .send({
            surname: "Smith",
            email: "james.smith@example.com",
            password: "password123!",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("forename is required");
          });
      });
      test("missing surname", () => {
        return request(app)
          .post("/register")
          .send({
            forename: "James",
            email: "james.smith@example.com",
            password: "password123!",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("surname is required");
          });
      });
      test("missing email", () => {
        return request(app)
          .post("/register")
          .send({
            forename: "James",
            surname: "Smith",
            password: "password123!",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("email is required");
          });
      });
      test("missing password", () => {
        return request(app)
          .post("/register")
          .send({
            forename: "James",
            surname: "Smith",
            email: "james.smith@example.com",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("password is required");
          });
      });
    });
  });
  describe("login", () => {
    test("posting a correct email and password should return a token and the user details", () => {
      return request(app)
        .post("/login")
        .send({ email: "alice@example.com", password: "hashed_password_123" })
        .expect(200)
        .then(({ body }) => {
          expect(body.token);
          expect(body.user).toMatchObject({
            forename: "Alice",
            surname: "Smith",
            email: "alice@example.com",
            gmail: "alice@gmail.com",
            avatar_url: "https://example.com/avatars/alice.jpg",
            staff: true,
          });
        });
    });
    test("posting an incorrect email should return 404 user not found", () => {
      return request(app)
        .post("/login")
        .send({ email: "walice@example.com", password: "hashed_password_123" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User not found");
        });
    });
    test("posting an incorrect password should return 401 incorrect password", () => {
      return request(app)
        .post("/login")
        .send({ email: "alice@example.com", password: "hashed" })
        .expect(401)
        .then(({ body }) => {
          expect(body.msg).toBe("Incorrect password");
        });
    });
  });
});
