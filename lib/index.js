const schedule = require('node-schedule')
const nunjucks = require('nunjucks')
const express = require('express')

const statisticsRoutes = require('./routes/statistics')
const systemRoutes = require('./routes/system')

async function runScheduler () {
  schedule.scheduleJob('3 * * * *', systemRoutes.recordVehicleStatus)
  console.log('🚀  Scheduler started')
}

async function runServer () {
  const app = express()

  nunjucks.configure('templates', {
    autoescape: true,
    express: app
  })

  app.get('/statistics/battery', statisticsRoutes.battery)
  app.get('/statistics/number-of-vehicles', statisticsRoutes.numberOfVehicles)

  app.post('/system/record-vehicle-status', systemRoutes.recordVehicleStatus)
  app.listen(3000, () => console.log('Example app listening on port 3000!'))
}

runScheduler()
runServer()
