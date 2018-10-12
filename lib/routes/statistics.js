const { DateTime } = require('luxon')

const datastore = require('../adapters/gcloudDatastore')
const cache = require('../adapters/cache')

async function _getLastNEntries (nEntries = 48) {
  const query = datastore.createQuery('Statistics')
    .order('collectedAt', { descending: true })
    .limit(nEntries)

  const res = await datastore.runQuery(query)
  const orderedResults = Array.from(res[0]).reverse()

  return orderedResults
}

function _createTimestampLabels (results) {
  return results.map((result) => {
    return DateTime.fromISO(result.collectedAt)
      .setZone('Europe/Stockholm')
      .toFormat('HH:mm ccc yyyy-MM-dd')
  })
}

async function battery (req, res) {
  const func = async function () {
    const lastEntries = await _getLastNEntries()

    const avgBatteryPercentages = lastEntries.map((result) => {
      return result.vehicles.averageBatteryPercentage
    })

    const collectedAtTimes = _createTimestampLabels(lastEntries)

    return { avgBatteryPercentages, collectedAtTimes }
  }

  const data = await cache.getOrFetchAndSet('battery', func)

  res.render('battery.html', data)
}

async function numberOfVehicles (req, res) {
  const func = async function () {
    const lastEntries = await _getLastNEntries()

    const numberOfVehicles = lastEntries.map(result => {
      return result.vehicles.all.length
    })

    const collectedAtTimes = _createTimestampLabels(lastEntries)

    return { numberOfVehicles, collectedAtTimes }
  }

  const data = await cache.getOrFetchAndSet('number-of-vehicles', func)

  res.render('numberOfVehicles.html', data)
}

module.exports = {
  battery,
  numberOfVehicles
}
