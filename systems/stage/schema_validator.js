/**
 * Small JSON-Schema (draft-07 subset) validator so the stage parser can validate against the
 * shipped `gps_stage_schema.json` itself, with no dependencies.
 *
 * Supported keywords: type, enum, const, required, properties, additionalProperties,
 * items, minItems, maxItems, minimum, maximum, exclusiveMinimum, exclusiveMaximum, minLength,
 * pattern, allOf, anyOf, oneOf, $ref ("#/definitions/..."), default/title/description ignored.
 */

function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (Number.isInteger(v)) return 'integer';
  return typeof v;
}

function typeMatches(v, t) {
  const actual = typeOf(v);
  if (t === 'number') return actual === 'number' || actual === 'integer';
  return actual === t;
}

function resolveRef(root, ref) {
  if (!ref.startsWith('#/')) throw new Error(`unsupported $ref "${ref}" (only local refs)`);
  let node = root;
  for (const part of ref.slice(2).split('/')) {
    node = node?.[part.replace(/~1/g, '/').replace(/~0/g, '~')];
    if (node === undefined) throw new Error(`unresolvable $ref "${ref}"`);
  }
  return node;
}

/**
 * @returns {Array<{path:string,message:string}>} empty when valid
 */
export function validateSchema(schema, data, root = schema, path = '$', errors = []) {
  if (schema.$ref) return validateSchema(resolveRef(root, schema.$ref), data, root, path, errors);

  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => typeMatches(data, t))) {
      errors.push({ path, message: `expected ${types.join(' | ')}, got ${typeOf(data)}` });
      return errors;
    }
  }
  if (schema.const !== undefined && data !== schema.const) errors.push({ path, message: `must equal ${JSON.stringify(schema.const)}` });
  if (schema.enum && !schema.enum.includes(data)) errors.push({ path, message: `must be one of ${JSON.stringify(schema.enum)}` });

  if (typeof data === 'number') {
    if (!Number.isFinite(data)) errors.push({ path, message: 'must be finite' });
    if (schema.minimum !== undefined && data < schema.minimum) errors.push({ path, message: `must be >= ${schema.minimum}` });
    if (schema.maximum !== undefined && data > schema.maximum) errors.push({ path, message: `must be <= ${schema.maximum}` });
    if (schema.exclusiveMinimum !== undefined && data <= schema.exclusiveMinimum) errors.push({ path, message: `must be > ${schema.exclusiveMinimum}` });
    if (schema.exclusiveMaximum !== undefined && data >= schema.exclusiveMaximum) errors.push({ path, message: `must be < ${schema.exclusiveMaximum}` });
  }
  if (typeof data === 'string') {
    if (schema.minLength !== undefined && data.length < schema.minLength) errors.push({ path, message: `length must be >= ${schema.minLength}` });
    if (schema.pattern && !new RegExp(schema.pattern).test(data)) errors.push({ path, message: `must match /${schema.pattern}/` });
  }
  if (Array.isArray(data)) {
    if (schema.minItems !== undefined && data.length < schema.minItems) errors.push({ path, message: `needs at least ${schema.minItems} items (has ${data.length})` });
    if (schema.maxItems !== undefined && data.length > schema.maxItems) errors.push({ path, message: `allows at most ${schema.maxItems} items (has ${data.length})` });
    if (schema.items) {
      // cap error spam on huge numeric arrays
      let bad = 0;
      for (let i = 0; i < data.length && bad < 5; i++) {
        const before = errors.length;
        validateSchema(schema.items, data[i], root, `${path}[${i}]`, errors);
        if (errors.length > before) bad++;
      }
    }
  }
  if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
    for (const key of schema.required ?? []) {
      if (!(key in data)) errors.push({ path: `${path}.${key}`, message: 'is required' });
    }
    const props = schema.properties ?? {};
    for (const [key, sub] of Object.entries(props)) {
      if (key in data) validateSchema(sub, data[key], root, `${path}.${key}`, errors);
    }
    if (schema.additionalProperties !== undefined) {
      for (const key of Object.keys(data)) {
        if (key in props) continue;
        if (schema.additionalProperties === false) errors.push({ path: `${path}.${key}`, message: 'is not allowed' });
        else if (typeof schema.additionalProperties === 'object') validateSchema(schema.additionalProperties, data[key], root, `${path}.${key}`, errors);
      }
    }
  }
  for (const sub of schema.allOf ?? []) validateSchema(sub, data, root, path, errors);
  if (schema.anyOf && !schema.anyOf.some((s) => validateSchema(s, data, root, path, []).length === 0)) {
    errors.push({ path, message: 'does not match any allowed shape' });
  }
  if (schema.oneOf) {
    const n = schema.oneOf.filter((s) => validateSchema(s, data, root, path, []).length === 0).length;
    if (n !== 1) errors.push({ path, message: `must match exactly one allowed shape (matches ${n})` });
  }
  return errors;
}
