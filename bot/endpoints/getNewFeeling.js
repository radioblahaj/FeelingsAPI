const {postNewFeeling} = require("../interactions/postNewFeeling")

module.exports = async function index(req, res) {
    const data = req.body
    const {feeling1, feeling2, note, share} = data
 
  await postNewFeeling(feeling1, feeling2, note, share)
  res.send("ok")
  
}
  