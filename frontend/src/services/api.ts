import axios from 'axios'

const PAYLOAD_URL = import.meta.env.VITE_PAYLOAD_URL || 'http://localhost:3000'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const api = axios.create({
  baseURL: `${PAYLOAD_URL}/api`,
})

// ── Tipos ──────────────────────────────────────────────
export interface PayloadMedia {
  id: number
  alt: string
  url: string
  filename: string
}

export interface PayloadEvento {
  id: number
  titulo: string
  descricao?: string | null
  imagem?: PayloadMedia | number | null
  link?: string | null
  dataInscricaoInicio?: string | null
  dataInscricaoFinal?: string | null
  dataEventoInicio?: string | null
  dataEventoFinal?: string | null
  categorias?: { nome?: string | null; id?: string | null }[] | null
  local?: string | null
  organizadores?: { email?: string | null; id?: string | null }[] | null
  colaboradores?: (number | { id: number; email: string })[] | null
  visivel?: boolean | null
  updatedAt: string
  createdAt: string
}

export interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// ── Helpers ────────────────────────────────────────────
export function getMediaUrl(media?: PayloadMedia | number | null): string | null {
  if (!media || typeof media === 'number') return null
  return `${PAYLOAD_URL}${media.url}`
}

// ── Eventos ────────────────────────────────────────────
export async function fetchEventos(params?: Record<string, unknown>): Promise<PayloadListResponse<PayloadEvento>> {
  if (USE_MOCK) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const raw = await import('../mocks/events.json')
    const docs: PayloadEvento[] = raw.default.map((e: any) => ({
      ...e,
      imagem: null,
    }))
    return {
      docs,
      totalDocs: docs.length,
      limit: docs.length,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }

  const { data } = await api.get<PayloadListResponse<PayloadEvento>>('/eventos', {
    params: { depth: 1, limit: 100, ...params },
  })
  return data
}

export async function fetchEvento(id: number): Promise<PayloadEvento> {
  if (USE_MOCK) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const raw = await import('../mocks/events.json')
    const found = raw.default.find((e: any) => e.id === id)
    if (!found) throw new Error('Not found')
    return { ...found, imagem: null }
  }

  const { data } = await api.get<PayloadEvento>(`/eventos/${id}`, {
    params: { depth: 1 },
  })
  return data
}

export async function createEvento(formData: FormData): Promise<PayloadEvento> {
  const { data } = await api.post<{ doc: PayloadEvento }>('/eventos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.doc
}

export async function updateEvento(id: number, body: Record<string, unknown>): Promise<PayloadEvento> {
  const { data } = await api.patch<{ doc: PayloadEvento }>(`/eventos/${id}`, body)
  return data.doc
}

export async function updateEventoWithForm(id: number, formData: FormData): Promise<PayloadEvento> {
  const { data } = await api.patch<{ doc: PayloadEvento }>(`/eventos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.doc
}

export async function deleteEvento(id: number): Promise<void> {
  await api.delete(`/eventos/${id}`)
}

// ── Media ──────────────────────────────────────────────
export async function uploadMedia(file: File, alt: string): Promise<PayloadMedia> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('alt', alt)
  const { data } = await api.post<{ doc: PayloadMedia }>('/media', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.doc
}

export { PAYLOAD_URL }
export default api