import { hash as _hash, compare as _compare } from "bcrypt";

export function hash(value = "") {
  return _hash(value, 10);
}

export async function compare(value, hValue) {
  return await _compare(value, hValue);
}
