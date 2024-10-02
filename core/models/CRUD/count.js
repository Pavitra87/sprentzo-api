export async function count(modelName, schema, query = {}) {
  let qr = await mongoModels[modelName].count(query);

  return qr;
}
