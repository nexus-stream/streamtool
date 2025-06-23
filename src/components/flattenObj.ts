export function flattenObj(obj?: object, baseKey?: string) {
  if (!obj) {
    return {};
  }

  let flattenedObj: { [key: string]: unknown } = {};

  for (const [key, value] of Object.entries(obj)) {
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
