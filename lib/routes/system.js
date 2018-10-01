const { DateTime } = require('luxon')

const datastore = require('../adapters/gcloudDatastore')
const vehicleStatus = require('../adapters/voiVehicleStatus')

async function recordVehicleStatus (req, res) {
  const now = DateTime.local()
  console.log(`${now.toISO()} Running recordVehicleStatus...`)

  const vehicleStats = await vehicleStatus.get()
  const key = now.toFormat('yyyy-LL-dd-HH')

  await datastore.save({
    key: datastore.key(['Statistics', key]),
    data: vehicleStats
  })

  console.log(`✨  Recorded vehicle status with key ${key}`)

  if (res) return res.status(200).end()
}

module.exports = {
  recordVehicleStatus
}
