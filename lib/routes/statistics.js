const { DateTime } = require('luxon')

const datastore = require('../adapters/gcloudDatastore')
const cache = require('../adapters/cache')

async function _getLastNEntries (nEntries = 48) {
  const cacheRes = await cache.getLatestStatistics(nEntries)
  if (cacheRes) return cacheRes

  const query = datastore.createQuery('Statistics')
    .order('collectedAt', { descending: true })
    .limit(nEntries)

  const res = await datastore.runQuery(query)
  const orderedResults = Array.from(res[0]).reverse()

  await cache.saveLatestStatistics(orderedResults, nEntries)

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
  const lastEntries = await _getLastNEntries()

  // const util = require('util')
  // console.log(util.inspect(lastEntries, {showHidden: false, depth: null}))
  const avgBatteryPercentages = lastEntries.map((result) => {
    return result.vehicles.averageBatteryPercentage
  })

  const collectedAtTimes = _createTimestampLabels(lastEntries)

  res.render('battery.html', { avgBatteryPercentages, collectedAtTimes })
}

async function numberOfVehicles (req, res) {
  const lastEntries = await _getLastNEntries()

  const numberOfVehicles = lastEntries.map(result => {
    return result.vehicles.all.length
  })

  const collectedAtTimes = _createTimestampLabels(lastEntries)

  res.render('numberOfVehicles.html', { numberOfVehicles, collectedAtTimes })
}

module.exports = {
  battery,
  numberOfVehicles
}
