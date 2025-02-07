const { postNewFeeling } = require("../interactions/postNewFeeling")

module.exports = async function index(req, res) {
    const newFeeling = req.body
    await postNewFeeling(newFeeling)
    res.send("ok")

}
