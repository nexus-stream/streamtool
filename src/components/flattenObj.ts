export function flattenObj(obj?: object, baseKey?: string) {
  if (!obj) {
    return {};
  }

  let flattenedObj: { [key: string]: unknown } = {};

  for (const [rawKey, value] of Object.entries(obj)) {
    const key = makeNumberKeysOneIndexed(rawKey);
    const path = baseKey ? `${baseKey}/${key}` : key;
    if (typeof value === "object") {
      flattenedObj = {
        ...flattenedObj,
        ...flattenObj(value, path),
      };
    } else {
      flattenedObj[path] = value;
    }
  }

  return flattenedObj;
}

function makeNumberKeysOneIndexed(key: string) {
  const numKey = parseInt(key);
  if (isNaN(numKey)) {
    return key;
  }

  return `${numKey + 1}`;
}
