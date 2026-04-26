export interface EventRecord {
  id: string
  titulo: string
  descricao: string
  local: string
  imagem: string | null
  categorias: string[]
  organizadores: string[]
  dataInscricaoInicio: string | null
  dataInscricaoFim: string | null
  dataEventoInicio: string
  dataEventoFim: string
  linkInformacao: string | null
  linkInscricao: string | null
}

export interface EventPayload {
  titulo: string
  descricao: string
  local: string
  categorias: string[]
  organizadores: string[]
  dataInscricaoInicio: string | null
  dataInscricaoFim: string | null
  dataEventoInicio: string
  dataEventoFim: string
  linkInformacao: string | null
  linkInscricao: string | null
  imagem?: File | null
}

export interface CategoryRecord {
  id: string
  nome: string
  descricao: string | null
}
