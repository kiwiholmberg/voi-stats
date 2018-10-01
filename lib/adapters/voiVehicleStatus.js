const got = require('got')

const { groupBy } = require('lodash')
const { DateTime } = require('luxon')

async function get(debug = false) {
  const res = await got('http://api.voiapp.io/v1/vehicle/status/ready', { json: true })
  const vehicles = res.body

  if (debug) console.log(JSON.stringify(vehicles, null, 2))

  console.log(`${res.body.length} vehicles found`)

  const lockedVehicles = vehicles.filter(vehicle => vehicle.locked)
  console.log(`Locked vehicles: ${lockedVehicles.length}`)

  const vehiclesByStatus = groupBy(vehicles, 'status')
  console.log(`Statuses present among vehicles: ${Object.keys(vehiclesByStatus)}`)

  const vehiclesByName = groupBy(vehicles, 'name')
  console.log(`Names present among vehicles: ${Object.keys(vehiclesByName)}`)

  const vehiclesByType = groupBy(vehicles, 'type')
  console.log(`Vehicles types present: ${Object.keys(vehiclesByType)}`)

  const vehiclesWithInvalidBattery = vehicles.filter(( { battery } ) => {
    return battery > 100 || battery < 0
  })
  console.log(`Vehicles with invalid battery percentage: ${vehiclesWithInvalidBattery.length}`)

  const averageBatteryPercentage = vehicles.reduce((acc, vehicle) => {
    return acc + vehicle.battery
  }, 0) / vehicles.length
  console.log(`Average battery percentage: ${Math.floor(averageBatteryPercentage)}`)

  const notUpdatedLast12h = vehicles.filter(vehicle => {
    const updatedAt = DateTime.fromISO(vehicles.updated)

    if (updatedAt < DateTime.local().minus(12, 'hours')) {
      console.log('Updated', vehicle.updated)
      return true
    }
  })
  console.log(`Vehicles not updated in the last 12 hours: ${notUpdatedLast12h.length}`)

  return {
    vehicles: {
      all: vehicles,
      lockedVehicles,
      vehiclesByStatus,
      vehiclesByName,
      vehiclesByType,
      vehiclesWithInvalidBattery,
      averageBatteryPercentage,
      notUpdatedLast12h
    }
  }
}

module.exports = {
  get
}
