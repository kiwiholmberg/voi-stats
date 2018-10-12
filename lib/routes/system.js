const { DateTime } = require('luxon')
const pRetry = require('p-retry')

const datastore = require('../adapters/gcloudDatastore')
const vehicleStatus = require('../adapters/voiVehicleStatus')

async function recordVehicleStatus (req, res) {
  const now = DateTime.local()
  console.log(`${now.toISO()} Running recordVehicleStatus...`)

  const vehicleStats = await vehicleStatus.get()
  const key = now.toFormat('yyyy-LL-dd-HH-mm')

  const datastoreSaveFunc = () => datastore.save({
    key: datastore.key(['Statistics', key]),
    data: vehicleStats
  })

  try {
    await pRetry(datastoreSaveFunc, {
      onFailedAttempt: err => {
        console.log('Datastore operation failed', err)
        console.log(`Attempt ${err.attemptNumber} failed. There are ${err.attemptsLeft} attempts left.`)

        if (err.code !== 14) throw pRetry.AbortError(err)
      },
      retries: 10
    })
    console.log(`✨  Recorded vehicle status with key ${key}`)

    await datastore.delete([
      datastore.key(['Cache', 'number-of-vehicles']),
      datastore.key(['Cache', 'battery'])
    ])
    console.log('✅  Cleared cache')
  } catch (err) {
    console.log('Error saving vehicle stats')
    console.error(err)
    if (res) return res.status(500).end()
  }

  if (res) return res.status(200).end()
}

module.exports = {
  recordVehicleStatus
}
