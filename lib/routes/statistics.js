const { DateTime, Duration } = require('luxon')

const { redis } = require('../adapters/redis')

async function _getEntriesLastNHours (lastNHours = 48) {
  const now = DateTime.local()

  const keys = []
  for (let i = lastNHours - 1; i >= 0; i--) {
    keys.push(
      now.minus(Duration.fromObject({ hours: i })).toFormat('yyyy-LL-dd-HH')
    )
  }

  const resultsForLastNHours = (await Promise.all(
    keys.map(key => redis.get(key))
  )).filter(entry => !!entry)
    .map(entry => JSON.parse(entry))

  return resultsForLastNHours
}

async function battery (req, res) {
  const resultsForLastNHours = await _getEntriesLastNHours()

  // const util = require('util')
  // console.log(util.inspect(resultsForLastNHours, {showHidden: false, depth: null}))
  const avgBatteryPercentages = resultsForLastNHours.map((result) => {
    return result.vehicles.averageBatteryPercentage
  })

  res.render('battery.html', { avgBatteryPercentages })
}

async function numberOfVehicles (req, res) {
  const resultsForLastNHours = await _getEntriesLastNHours()

  const numberOfVehicles = resultsForLastNHours.map(result => {
    return result.vehicles.all.length
  })

  res.render('numberOfVehicles.html', { numberOfVehicles })
}

module.exports = {
  battery,
  numberOfVehicles
}