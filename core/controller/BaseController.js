export default class BaseController {
  constructor(_modelName, _schema) {
    this.modelName = _modelName;
    this.model = global[this.modelName]
  }

  async readAll(req, res) {
    try {

      const data = await this.model.readAll(req.query, { updatedAt: -1 }, req.query.limit || 10, req.query.skip || 0);
      const count = await this.model.count(req.query);

      res.send({ data, count });
    } catch (e) {
      res.status(500).send(e)
    }
  }
  async readOne(req, res) {
    const data = await this.model.readOne(req.params.id);

    if (!data) {
      res.status(404);
      return res.send({ message: "Data with id not found " })
    }
    res.send(data);
  }
  async create(req, res) {

    const en = new this.model(req.body);
    try {
      let result = await en.save();
      res.send(result);
    } catch (e) {
      console.log(e.code)
      if (e.code === 11000)
        res.status(500).send("Duplicate entry");
      else
        res.status(500).send(e);
    }

  }
  async update(req, res) {
    const en = new this.model({ _id: req.params.id, ...req.body });
    let result = await en.update();
    res.send(result);
  }
  async delete(req, res) {
    const en = new this.model({ _id: req.params.id, ...req.body });
    let result = await en.delete();
    res.send(result);
  }
}

global.BaseController = BaseController;
