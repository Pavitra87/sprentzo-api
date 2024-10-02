export async function _delete(modelName, schema) {

    return await global.mongoModels[modelName].deleteOne(
      { _id: this._data._id }
    );
  }
  