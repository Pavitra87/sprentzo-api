import fs from "fs/promises";

async function loadAllEntities() {
  const directoryPath = "./entities";

  // Read the files in the directory
  const files = await fs.readdir(directoryPath);
  await Promise.all(
    files.map(async (file) => {
      if (file !== "index.js") {
        const model = await import(`./${file}/${file}Model.js`);
        const controller = await import(`./${file}/${file}Controller.js`);
        global[file] = model.default;
        global[file + "Controller"] = controller.default;
      }

    })
  );
}
export default loadAllEntities;
