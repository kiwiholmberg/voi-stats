const memjs = require('memjs')

const VEHICLE_STATISTICS_KEY = 'voi-statistics'

const mc = memjs.Client.create()

async function saveLatestStatistics (statuses, keySuffix) {
  await mc.set(`${VEHICLE_STATISTICS_KEY}-${keySuffix}`, JSON.stringify(statuses))
  return statuses
}

async function getLatestStatistics (keySuffix) {
  const res = await mc.get(`${VEHICLE_STATISTICS_KEY}-${keySuffix}`)
  if (res) return JSON.parse(res)
}

module.exports = {
  getLatestStatistics,
  saveLatestStatistics
}
