import { H3Event } from 'h3';

const menuScript = 'for(const e of document.getElementsByClassName("dropdown"))if("menu_trascript2"!==e.id){if(e.hasAttribute("style")){e.removeAttribute("style"),e.children[0].setAttribute("style","color: lightgray;");for(const t of e.children[1].children)t.removeAttribute("style"),t.children[0].setAttribute("style","color: lightgray;")}if(e.children.length>1)for(const t of e.children[1].children)t.addEventListener("click",(()=>pageJump(t.innerText))),t.hasAttribute("style")&&(t.removeAttribute("style"),t.children[0].setAttribute("style","color: lightgray;"));else e.addEventListener("click",(()=>pageJump(e.innerText)))}'

async function toFormData(event: H3Event) {
  const obj = {...await readBody(event).catch(() => {})}
  // Convert response body to FormData
  const form = new FormData()
  for (const [key, value] of Object.entries(obj) as [string, string][]) {
    form.set(key, value)
  }
  return form
}

async function appendScript(html: string) {
  // Process HTML
  let processedHtml = html.replace( /<body/g , `<body onLoad='${menuScript}' `)
  processedHtml = processedHtml.replace( /<\/body>/ , '<script src="https://cdn.jsdelivr.net/gh/Computerization/Easy-TSIMS@master/Easy-TSIMS-extension/scripts/modify_navbar.js" defer></script></body>')
  return processedHtml
}

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  let data = undefined
  const headers = {}

  for (const [key, value] of Object.entries(Object.fromEntries(event.headers))) {
    if (key === 'cookie') {
      headers[key] = value
    }
  }

  if (event.method === 'GET' || event.method === 'HEAD') {
    data = await $fetch.raw(useRuntimeConfig(event).tsimsUrl + path, {
      headers: headers,
      method: event.method
    })
  } else {
    data = await $fetch.raw(useRuntimeConfig(event).tsimsUrl + path, {
      headers: headers,
      body: await toFormData(event),
      method: event.method
    })
  }

  let responseBody = data._data

  for (const [key, value] of Object.entries(Object.fromEntries(data.headers))) {
    if (key === 'content-type' || key === 'set-cookie') {
      setHeader(event, key, value)
    }
    if (key === 'content-type' && value.includes('text/html')) {
      responseBody = await appendScript(data._data)
    }
  }

  return responseBody
})
