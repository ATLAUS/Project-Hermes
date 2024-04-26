const { httpServer } = require('./src/app')
const { db } = require('./db/connection')
const port = 3000

httpServer.listen(port, () => {
  db.sync()
  console.log(`Listening at http://localhost:${port}/`)
})
