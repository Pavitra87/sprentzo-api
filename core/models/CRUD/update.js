export async function update(modelName, schema) {
  console.log(
    "this._data--------------------------+++++++++++++++++++++++++++++++++++++++++++++++++++++++"
  );
  console.log(this._data);
  return await global.mongoModels[modelName].updateOne(
    { _id: this._data._id },
    this._data
  );
}
