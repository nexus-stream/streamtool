// We want values from this tool to be accessible from Advanced Scene Switcher.
// In theory, we could just send the state object to it, but the weird JSON
// parsing macro they have isn't solid enough for me to trust it with nested
// objects that don't always have the exact same schema.
//
// Instead, this helper flattens the object with "/" as the separator between
// keys. So { foo: { bar: 'baz' } } would become { 'foo/bar': 'baz }.
//
// We also one-index all arrays so I don't have to explain zero indexing to
// onon-programmers.
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
