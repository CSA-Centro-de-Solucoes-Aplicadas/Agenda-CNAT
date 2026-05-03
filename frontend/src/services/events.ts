import api, { API_URL } from '@/services/api'
import type { CategoryRecord, EventPayload, EventRecord } from '@/types/event'

interface PayloadMedia {
  id: number
  url?: string | null
}

interface PayloadEvento {
  id: number | string
  titulo?: string | null
  descricao?: string | null
  local?: string | null
  imagem?: PayloadMedia | number | string | null
  link?: string | null
  linkInformacao?: string | null
  linkInscricao?: string | null
  dataInscricaoInicio?: string | null
  dataInscricaoFinal?: string | null
  dataInscricaoFim?: string | null
  dataEventoInicio?: string | null
  dataEventoFinal?: string | null
  dataEventoFim?: string | null
  categorias?: Array<string | { nome?: string | null }> | null
  organizadores?: Array<string | { email?: string | null }> | null
}

interface PayloadListResponse<T> {
  docs: T[]
}

function normalizeMediaUrl(media: PayloadEvento['imagem']) {
  if (!media || typeof media === 'number') return null
  if (typeof media === 'string') return media
  if (!media.url) return null
  if (media.url.startsWith('http')) return media.url
  return `${API_URL}${media.url}`
}

function normalizeCategories(values: PayloadEvento['categorias']) {
  return (values ?? [])
    .map((value) => (typeof value === 'string' ? value : value.nome))
    .filter((value): value is string => Boolean(value))
}

function normalizeOrganizers(values: PayloadEvento['organizadores']) {
  return (values ?? [])
    .map((value) => (typeof value === 'string' ? value : value.email))
    .filter((value): value is string => Boolean(value))
}

function normalizeEvent(event: PayloadEvento): EventRecord {
  return {
    id: String(event.id),
    titulo: event.titulo ?? '',
    descricao: event.descricao ?? '',
    local: event.local ?? '',
    imagem: normalizeMediaUrl(event.imagem),
    categorias: normalizeCategories(event.categorias),
    organizadores: normalizeOrganizers(event.organizadores),
    dataInscricaoInicio: event.dataInscricaoInicio ?? null,
    dataInscricaoFim: event.dataInscricaoFim ?? event.dataInscricaoFinal ?? null,
    dataEventoInicio: event.dataEventoInicio ?? '',
    dataEventoFim: event.dataEventoFim ?? event.dataEventoFinal ?? '',
    linkInformacao: event.linkInformacao ?? event.link ?? null,
    linkInscricao: event.linkInscricao ?? null,
  }
}

function unwrapDoc<T extends { id: number | string }>(data: T | { doc?: T }): T {
  if ('doc' in data) {
    if (data.doc) return data.doc
    throw new Error('Resposta do backend sem documento.')
  }

  return data as T
}

function getEventsFromResponse(data: PayloadEvento[] | PayloadListResponse<PayloadEvento>) {
  return Array.isArray(data) ? data : data.docs
}

function buildPayloadBody(payload: EventPayload, imageId?: number) {
  const body: Record<string, unknown> = {
    titulo: payload.titulo,
    descricao: payload.descricao,
    local: payload.local,
    dataEventoInicio: payload.dataEventoInicio,
    dataEventoFinal: payload.dataEventoFim,
    categorias: payload.categorias.map((nome) => ({ nome })),
    organizadores: payload.organizadores.map((email) => ({ email })),
    visivel: true,
  }

  const link = payload.linkInformacao || payload.linkInscricao
  if (link) body.link = link
  if (payload.dataInscricaoInicio) body.dataInscricaoInicio = payload.dataInscricaoInicio
  if (payload.dataInscricaoFim) body.dataInscricaoFinal = payload.dataInscricaoFim
  if (imageId) body.imagem = imageId

  return body
}

function appendArray(formData: FormData, key: string, values: string[]) {
  values.forEach((value) => formData.append(key, value))
}

function buildDjangoEventFormData(payload: EventPayload) {
  const formData = new FormData()

  formData.append('titulo', payload.titulo)
  formData.append('descricao', payload.descricao)
  formData.append('local', payload.local)
  formData.append('dataEventoInicio', payload.dataEventoInicio)
  formData.append('dataEventoFim', payload.dataEventoFim)

  if (payload.linkInformacao) formData.append('linkInformacao', payload.linkInformacao)
  if (payload.linkInscricao) formData.append('linkInscricao', payload.linkInscricao)
  if (payload.dataInscricaoInicio) formData.append('dataInscricaoInicio', payload.dataInscricaoInicio)
  if (payload.dataInscricaoFim) formData.append('dataInscricaoFim', payload.dataInscricaoFim)
  if (payload.imagem) formData.append('imagem', payload.imagem)

  appendArray(formData, 'categorias', payload.categorias)
  appendArray(formData, 'organizadores', payload.organizadores)

  return formData
}

async function uploadMedia(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('alt', file.name)

  const { data } = await api.post<{ doc?: PayloadMedia } | PayloadMedia>('/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return unwrapDoc(data).id
}

export async function listEvents(params?: Record<string, string>) {
  try {
    const { data } = await api.get<PayloadEvento[] | PayloadListResponse<PayloadEvento>>('/eventos', {
      params: { depth: 1, limit: 100, ...params },
    })
    return getEventsFromResponse(data).map(normalizeEvent)
  } catch (error: any) {
    if (error?.response?.status !== 404) throw error
    const { data } = await api.get<PayloadEvento[]>('/events/', { params })
    return data.map(normalizeEvent)
  }
}

export async function getEvent(id: string) {
  try {
    const { data } = await api.get<PayloadEvento>(`/eventos/${id}`, {
      params: { depth: 1 },
    })
    return normalizeEvent(data)
  } catch (error: any) {
    if (error?.response?.status !== 404) throw error
    const { data } = await api.get<PayloadEvento>(`/events/${id}/`)
    return normalizeEvent(data)
  }
}

export async function createEvent(payload: EventPayload) {
  try {
    let imageId: number | string | undefined

    if (payload.imagem) {
      try {
        imageId = await uploadMedia(payload.imagem)
      } catch (error) {
        console.warn('Não foi possível enviar a imagem. O evento será cadastrado sem capa.', error)
      }
    }

    const { data } = await api.post<{ doc?: PayloadEvento } | PayloadEvento>(
      '/eventos',
      buildPayloadBody(payload, typeof imageId === 'number' ? imageId : undefined),
    )
    return normalizeEvent(unwrapDoc(data))
  } catch (error: any) {
    if (error?.response?.status !== 404) throw error
    const { data } = await api.post<PayloadEvento>('/events/', buildDjangoEventFormData(payload))
    return normalizeEvent(data)
  }
}

export async function updateEvent(id: string, payload: EventPayload) {
  try {
    const imageId = payload.imagem ? await uploadMedia(payload.imagem) : undefined
    const { data } = await api.patch<{ doc?: PayloadEvento } | PayloadEvento>(
      `/eventos/${id}`,
      buildPayloadBody(payload, imageId),
    )
    return normalizeEvent(unwrapDoc(data))
  } catch (error: any) {
    if (error?.response?.status !== 404) throw error
    const { data } = await api.put<PayloadEvento>(`/events/${id}/`, buildDjangoEventFormData(payload))
    return normalizeEvent(data)
  }
}

export async function deleteEvent(id: string) {
  try {
    await api.delete(`/eventos/${id}`)
  } catch (error: any) {
    if (error?.response?.status !== 404) throw error
    await api.delete(`/events/${id}/`)
  }
}

export async function listCategories(): Promise<CategoryRecord[]> {
  try {
    const { data } = await api.get<CategoryRecord[]>('/categories/')
    return data
  } catch (error: any) {
    if (error?.response?.status !== 404) throw error
    const events = await listEvents()
    const names = [...new Set(events.flatMap((event) => event.categorias))].sort()
    return names.map((nome) => ({ id: nome, nome, descricao: null }))
  }
}
