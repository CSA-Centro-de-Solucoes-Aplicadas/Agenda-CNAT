import { getPayload, Payload } from 'payload'
import config from '../payload.config'

async function run() {
  const payloadConfig = await config
  const payload: Payload = await getPayload({ config: payloadConfig })

  const events = [
    {
      titulo: 'Evento de Teste 1',
      descricao: 'Descrição do evento de teste 1',
      dataEventoInicio: new Date().toISOString(),
      dataEventoFinal: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      visivel: true,
    },
    {
      titulo: 'Evento de Teste 2',
      descricao: 'Descrição do evento de teste 2',
      dataEventoInicio: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      dataEventoFinal: new Date(Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 60).toISOString(),
      visivel: true,
    },
  ]

  for (const ev of events) {
    // Use server-side Payload API to bypass HTTP auth
    // If an event with the same title exists, skip
    const exists = await payload.find({ collection: 'eventos', where: { titulo: { equals: ev.titulo } } })
    if (exists.totalDocs > 0) {
      console.log(`Pulando, já existe: ${ev.titulo}`)
      continue
    }
    await payload.create({ collection: 'eventos', data: ev })
    console.log(`Criado: ${ev.titulo}`)
  }

  console.log('Seed finalizado')
  process.exit(0)
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
