import { type Server } from 'bun'
import { lookup } from 'dns'
import { promisify } from 'util'

const checkDNS = promisify(lookup)
const server = Bun.serve({
  port: 1337,
  fetch: async (request: Request, server: Server) => {
    console.log(request.url)
    const { searchParams, pathname } = new URL(request.url)
    if (pathname !== '/') return new Response('', { status: 404 })
    try {
      const result = await checkDNS(searchParams.get('server')!)
      console.log(result)
      return new Response(JSON.stringify({ ...result }))
    } catch (err) {
      console.log(err)
      return new Response(JSON.stringify({ error: (err as Error).code }))
    }
  }
})

console.log(`Listening on localhost:${server.port}`)
