import * as bcrypt from "bcrypt";

export async function hash(input: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(input, salt);
}

export async function compare(token: string, toCompare: string) {
  return await bcrypt.compare(token, toCompare);
}
