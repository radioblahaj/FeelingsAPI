const { postNewFeeling } = require("../interactions/postNewFeeling")

module.exports = async function index(req, res) {
    await postNewFeeling(req.body)
}
