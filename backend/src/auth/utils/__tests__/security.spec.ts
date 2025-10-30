import { compare, hash } from "../security";

describe("Security Utils", () => {
  test("hash a string", async () => {
    const response = await hash("test");
    expect(response).toEqual(expect.any(String));
    expect(response).not.toBe("test");
  });

  test("hash the same string twice results in different hashes", async () => {
    const hash1 = await hash("test");
    const hash2 = await hash("test");
    expect(hash1).not.toBe(hash2);
  });

  test("hash and compare", async () => {
    const password = "test";
    const hashed = await hash(password);
    const isMatch = await compare(password, hashed);
    expect(isMatch).toBe(true);
  });
});
