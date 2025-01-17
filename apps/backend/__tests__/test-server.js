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

describe("", () => {
  test("", () => {});
});
