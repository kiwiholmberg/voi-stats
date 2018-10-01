const nunjucks = require('nunjucks')
const express = require('express')

const statisticsRoutes = require('./routes/statistics')
const systemRoutes = require('./routes/system')

async function runServer () {
  const PORT = process.env.PORT || 3000
  const app = express()

  nunjucks.configure('templates', {
    autoescape: true,
    express: app
  })

  app.get('/statistics/battery', statisticsRoutes.battery)
  app.get('/statistics/number-of-vehicles', statisticsRoutes.numberOfVehicles)

  app.get('/system/record-vehicle-status', systemRoutes.recordVehicleStatus)

  app.get('/', (req, res) => res.render('index.html'))

  app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
}

runServer()
