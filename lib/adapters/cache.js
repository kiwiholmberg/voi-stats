const datastore = require('./gcloudDatastore')

async function getOrFetchAndSet (key, pFetchFunction) {
  const dsKey = datastore.key(['Cache', key])

  const [cacheRes] = await datastore.get(dsKey)
  if (cacheRes) return cacheRes

  const res = await Promise.resolve().then(pFetchFunction)

  await datastore.save({
    key: dsKey,
    data: res
  })

  return res
}

module.exports = {
  getOrFetchAndSet
}
