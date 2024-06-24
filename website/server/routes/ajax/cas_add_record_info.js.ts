export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  const casScript = await $fetch('https://github.com/Computerization/Easy-TSIMS/raw/master/Easy-TSIMS-extension/scripts/better_cas_add_record_info.js')

  let data = undefined
  const headers = {}

  for (const [key, value] of Object.entries(Object.fromEntries(event.headers))) {
    if (key === 'cookie') {
      headers[key] = value
    }
  }

  data = await $fetch.raw(useRuntimeConfig(event).tsimsUrl + path, {
    headers: headers,
    method: event.method
  })

  for (const [key, value] of Object.entries(Object.fromEntries(data.headers))) {
    if (key === 'content-type' || key === 'set-cookie') {
      setHeader(event, key, value)
    }
  }

  return await data._data.text() + '\n' + casScript
})
