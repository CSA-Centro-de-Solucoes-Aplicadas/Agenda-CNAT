import api from '@/services/api'
import type { CategoryRecord, EventPayload, EventRecord } from '@/types/event'

function appendArray(formData: FormData, key: string, values: string[]) {
  values.forEach((value) => formData.append(key, value))
}

function buildEventFormData(payload: EventPayload) {
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

export async function listEvents(params?: Record<string, string>) {
  const { data } = await api.get<EventRecord[]>('/events/', { params })
  return data
}

export async function getEvent(id: string) {
  const { data } = await api.get<EventRecord>(`/events/${id}/`)
  return data
}

export async function createEvent(payload: EventPayload) {
  const { data } = await api.post<EventRecord>('/events/', buildEventFormData(payload))
  return data
}

export async function updateEvent(id: string, payload: EventPayload) {
  const { data } = await api.put<EventRecord>(`/events/${id}/`, buildEventFormData(payload))
  return data
}

export async function deleteEvent(id: string) {
  await api.delete(`/events/${id}/`)
}

export async function listCategories() {
  const { data } = await api.get<CategoryRecord[]>('/categories/')
  return data
}
