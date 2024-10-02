export async function readOne(
  modelName,
  _id,
  schema,
  limit = 10,
  skip = 0,
) {
  let qr = mongoModels[modelName].find({_id});
  let refs = [];
  for (const attr in schema) {
    if (Array.isArray(schema[attr].type)) {
      if (schema[attr].type[0] === "model") refs.push(attr);
      else{
        if (typeof schema[attr].type[0] === "object"){
          Object.keys(schema[attr].type[0]).forEach(elem=>{
            if(typeof schema[attr].type[0][elem].type==="function"){
              refs.push(`${attr}.${elem}`)
              console.log(`${attr}.${elem}`)
            }
          })
        } 
      }
    } else if (typeof schema[attr].type !== "string") {
      refs.push(attr);
    }
  }

  refs.reduce((a, b) => a.populate(b), qr);
  const result = await qr.limit(limit).skip(skip);

  return result.map((d) => {
     return new global[modelName]({ ...d._doc }, d);
  })[0] || null;
}
