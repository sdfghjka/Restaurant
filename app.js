const express = require("express")
const app = express()
const port = 3000

app.get('/',(req, res) => {
  res.redirect('/restaurants')
})
app.get('/restaurants',(req ,res) =>{
  res.send('ffff')
})
app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  res.send(`${id}`)
})
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})