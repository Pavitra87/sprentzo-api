
class VenueController extends BaseVenueController {
    constructor() {
        super()
    }
    async readAll(req, res) {
        try {
            const { sports = "" } = req.query
            const query = {}
            if (sports) {
                const sport = await Sport.readAll({ "name": sports })
                console.log(sport)
                if (!sport.length) {
                    return res.status(404).send(`${sports} is not available yet.`)
                }
                query.sports = sport[0]._data._id.toString()
            }
            console.log(query)
            const data = await this.model.readAll(query);

            res.send({ data });
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    }
}
export default VenueController
