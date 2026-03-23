export function makeNestedObject(path: string, value: any): object {
  const keys = path.split(".");
  let result: any = {};
  let current = result;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = {};
      current = current[key];
    }
  }
  return result;
}
