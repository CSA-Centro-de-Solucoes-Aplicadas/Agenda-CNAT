<script setup lang="ts">
import { ref, computed } from 'vue'
import iconLista from '@/assets/iconLista.png'
import iconCalendario from '@/assets/iconCalendario.png'

const horaInicio = 6
const horaFim = 23
const alturaHora = 100

const modoVisualizacao = ref<'hoje' | 'semana'>('semana')
const tipoVisualizacao = ref<'calendario' | 'lista'>('calendario')
const categoriaSelecionada = ref('Todas')

interface Evento {
  titulo: string
  datas: string[]
  inicio: string
  fim: string
  categoria: string
  local: string
}
interface GrupoEvento {
  inicio: string
  fim: string
  eventos: EventoVisual[]
}

const eventos = ref<Evento[]>([
  {
    titulo: 'Arraiá Junino',
    datas: ['14-12-2025', '15-12-2025', '16-12-2025'], // consecutivos
    inicio: '07:00',
    fim: '11:00',
    categoria: 'Esportes',
    local: 'Ginásio'
  },
  {
    titulo: 'CineBiblio',
    datas: ['14-12-2025', '18-12-2025'], // quebrados
    inicio: '08:00',
    fim: '11:00',
    categoria: 'Cultura',
    local: 'Biblioteca'
  }
])


//  CATEGORIAS  
const categorias = computed(() => {
  const unicas = new Set(eventos.value.map(e => e.categoria))
  return ['Todas', ...unicas]
})
// CORES POR CATEGORIA
const coresCategorias = computed<Record<string, string>>(() => {
  const categoriasUnicas = Array.from(
    new Set(eventos.value.map(e => e.categoria))
  )

  const baseHue = 145 // verde
  const saturation = 45
  const lightnessBase = 78

  const mapa: Record<string, string> = {}

  categoriasUnicas.forEach((cat, index) => {
    const lightness = lightnessBase - index * 6
    mapa[cat] = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`
  })

  return mapa
})

//DATAS 
const dataBaseAgenda = ref(new Date())

function formatarData(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${d}-${m}-${y}`
}


const diasSemana = computed(() => {
  const base = dataBaseAgenda.value
  const inicio = new Date(base)

  // segunda-feira
  inicio.setDate(base.getDate() - ((base.getDay() + 6) % 7))

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    return d
  })
})



//  MÊS / ANO 
const mesAnoAtual = computed(() => {
  const base =
    modoVisualizacao.value === 'hoje'
      ? dataBaseAgenda.value
      : diasSemana.value[0] ?? dataBaseAgenda.value

  const mes = base.toLocaleDateString('pt-BR', { month: 'long' })
  const ano = base.getFullYear()

  return `${mes}, ${ano}`
})

function gruposDeEventosDoDia(data: Date): GrupoEvento[] {
  const d = formatarData(data)

  // eventos já filtrados e visuais
  const eventosDia = eventosFiltrados.value.filter(e => e.data === d)

  const mapa = new Map<string, GrupoEvento>()

  for (const evento of eventosDia) {
    const chave = `${evento.inicio}-${evento.fim}`

    if (!mapa.has(chave)) {
      mapa.set(chave, {
        inicio: evento.inicio,
        fim: evento.fim,
        eventos: []
      })
    }

    mapa.get(chave)!.eventos.push(evento)
  }

  return Array.from(mapa.values())
}


interface EventoVisual extends Evento {
  data: string
  span: number // quantos dias consecutivos
}
function criarEventosVisuais(eventos: Evento[]): EventoVisual[] {
  const resultado: EventoVisual[] = []

  for (const evento of eventos) {
    if (!evento.datas.length) continue

    const datasOrdenadas = [...evento.datas].sort()

    let inicioSpan: string = datasOrdenadas[0]!
    let span = 1

    for (let i = 1; i < datasOrdenadas.length; i++) {
      const atual = datasOrdenadas[i]!
      const anterior = datasOrdenadas[i - 1]!

      const d1 = new Date(anterior.split('-').reverse().join('-'))
      const d2 = new Date(atual.split('-').reverse().join('-'))

      const consecutivo =
        d2.getTime() - d1.getTime() === 86400000

      if (consecutivo) {
        span++
      } else {
        resultado.push({
          ...evento,
          data: inicioSpan,
          span
        })

        inicioSpan = atual
        span = 1
      }
    }

    // último bloco
    resultado.push({
      ...evento,
      data: inicioSpan,
      span
    })
  }

  return resultado
}

const estiloEventoGrupo = (evento: EventoVisual, index: number, total: number, grupo: GrupoEvento, dia: Date) => {
  const inicio = minutos(grupo.inicio)
  const fim = minutos(grupo.fim)

  const top = ((inicio - horaInicio * 60) / totalMinutos) * totalAltura
  const height = ((fim - inicio) / totalMinutos) * totalAltura

  const deslocamento = 20
  const left = index * deslocamento
  const larguraMax = 160
  const width = larguraMax - deslocamento * (total - 1) // largura ajustada

  return {
    top: `${top}px`,
    height: `${height}px`,
    width: `${width}px`,
    left: `${left}px`,
    zIndex: 100 - index,
    borderRight: index === 0 ? 'none' : '2px solid rgba(255,255,255,0.5)', // só borda direita dos cards abaixo
    backgroundColor: coresCategorias.value[evento.categoria] || '#00b894',
    color: '#fff'
  }
}



const eventosVisuais = computed(() =>
  criarEventosVisuais(eventos.value)
)

//FILTRO 
const eventosFiltrados = computed(() => {
  return eventosVisuais.value.filter(e => {
    const categoriaOk =
      categoriaSelecionada.value === 'Todas' ||
      e.categoria === categoriaSelecionada.value

    const dataOk =
      modoVisualizacao.value === 'hoje'
        ? e.data === formatarData(dataBaseAgenda.value)
        : diasSemana.value.some(d => formatarData(d) === e.data)

    return categoriaOk && dataOk
  })
})



// POSIÇÃO EVENTO
function minutos(hora: string): number {
  const [h, m] = hora.split(':')
  return Number(h) * 60 + Number(m)
}

const totalMinutos = (horaFim - horaInicio) * 60
const totalAltura = (horaFim - horaInicio) * alturaHora

// Eventos grupo
function estiloGrupo(grupo: GrupoEvento) {
  const inicio = minutos(grupo.inicio)
  const fim = minutos(grupo.fim)

  return {
    top: `${((inicio - horaInicio * 60) / totalMinutos) * totalAltura}px`,
    height: `${((fim - inicio) / totalMinutos) * totalAltura}px`
  }
}
const grupoAberto = ref<string | null>(null)

function toggleGrupo(id: string) {
  grupoAberto.value = grupoAberto.value === id ? null : id
}
function primeiroEvento(grupo: GrupoEvento): EventoVisual {
  return grupo.eventos[0] as EventoVisual
}


function spanVisivel(evento: EventoVisual, dia: Date) {
  const indexDia = diasSemana.value.findIndex(
    d => formatarData(d) === evento.data
  )

  if (indexDia === -1) return 1

  return Math.min(evento.span, 7 - indexDia)
}


// navegação de semana em semana 

function semanaAnterior() {
  dataBaseAgenda.value = new Date(
    dataBaseAgenda.value.setDate(
      dataBaseAgenda.value.getDate() - 7
    )
  )
}

function proximaSemana() {
  dataBaseAgenda.value = new Date(
    dataBaseAgenda.value.setDate(
      dataBaseAgenda.value.getDate() + 7
    )
  )
}

</script>

<template>
  <div class="agenda">
    <header class="topo">
      <div class="nav-semana">
        <button class="nav-btn" @click="semanaAnterior">◀</button>
        <h2 class="titulo">{{ mesAnoAtual }}</h2>
        <button class="nav-btn" @click="proximaSemana">▶</button>
      </div>

      <div class="toggle-wrapper">
        <button
          class="toggle-btn"
          :class="{ ativo: modoVisualizacao === 'semana' }"
          @click="modoVisualizacao = 'semana'"
        >
          Semana
        </button>
        <button
          class="toggle-btn"
          :class="{ ativo: modoVisualizacao === 'hoje' }"
          @click="modoVisualizacao = 'hoje'"
        >
          Hoje
        </button>
      </div>

      <div class="acoes-direita">
        <button
          class="icon-btn"
          :class="{ ativo: tipoVisualizacao === 'lista' }"
          @click="tipoVisualizacao = 'lista'"
        >
          <img :src="iconLista" alt="Lista" />
        </button>

        <button
          class="icon-btn"
          :class="{ ativo: tipoVisualizacao === 'calendario' }"
          @click="tipoVisualizacao = 'calendario'"
        >
          <img :src="iconCalendario" alt="Calendário" />
        </button>

        <select v-model="categoriaSelecionada">
          <option v-for="cat in categorias" :key="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </header>
 <!-- dias -->
    <div v-if="tipoVisualizacao === 'calendario'" class="barra-dias">
      <div class="espaco-horarios"></div>

      <div class="chips">
        <div
          v-for="dia in modoVisualizacao === 'hoje' ? [dataBaseAgenda] : diasSemana"
          :key="dia.toDateString()"
          class="chip-dia"
          :class="{ hoje: formatarData(dia) === formatarData(dataBaseAgenda) }"
        >
          <span class="numero">{{ dia.getDate() }}</span>
          <span class="semana">
            {{ dia.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase() }}
          </span>
        </div>
      </div>
    </div>

    <div class="conteudo">
      <!-- LISTA -->
      <div v-if="tipoVisualizacao === 'lista'" class="lista">
        <div
          v-for="evento in eventosFiltrados"
          :key="evento.titulo + evento.data"
          class="item-lista"
        >
          <div class="badge">{{ evento.titulo }}</div>

          <div class="info">
            <strong>{{ evento.data }}</strong>
            <span>{{ evento.local }}</span>
          </div>
        </div>
      </div>

      <!-- CALENDÁRIO -->
      <div
        v-else
        class="grade"
        :class="{ 'modo-hoje': modoVisualizacao === 'hoje' }"
      >
        <div class="grade-conteudo">
          <!-- HORÁRIOS -->
          <div class="horarios">
           <div
              v-for="h in horaFim - horaInicio + 1"
              :key="h"
              class="hora"
            >
              {{ String(h + horaInicio - 1).padStart(2, '0') }}:00
            </div>

          </div>

          <!-- DIAS -->
          <div class="dias">
            <div
              v-for="dia in modoVisualizacao === 'hoje' ? [dataBaseAgenda] : diasSemana"
              :key="dia.toDateString()"
              class="dia"
            >
                    <div
                      class="coluna-eventos"
                      :style="{ height: `${(horaFim - horaInicio) * alturaHora}px` }"
                    >
                    <div v-for="grupo in gruposDeEventosDoDia(dia)" :key="grupo.inicio + grupo.fim" class="evento-grupo" :style="estiloGrupo(grupo)">
                      <div
                        v-for="(ev, i) in grupo.eventos"
                        :key="i"
                        class="evento"
                        :style="estiloEventoGrupo(ev, i, grupo.eventos.length, grupo, dia)"
                      >
                        <div class="conteudo-evento">
                          <strong class="titulo-evento">{{ ev.titulo }}</strong>
                          <small class="local-evento">{{ ev.local }}</small>
                          <span class="horario-evento">{{ grupo.inicio }} às {{ grupo.fim }}</span>
                        </div>
                      </div>

                      <!-- Indicador de mais eventos -->
                      <span v-if="grupo.eventos.length > 1" class="mais-eventos">
                        ▶ {{ grupo.eventos.length - 1 }}
                      </span>
                    </div>
                  </div>


    
                 </div>
                </div>

              </div>
            </div>
          </div>
      </div>
</template>

<style scoped>
.agenda { background: #ffffff;
  padding: 0px; 
  border-radius: 12px;
  max-width: 1300px;
  max-height: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: sans-serif; }

.topo {
  background: #f0f0f0;
  padding: 12px 16px;       
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  margin: 0;               
  border-radius: 0;         
  border: 2px solid #dad7d7;   
}
.grade {
  border-top: none;
}

.titulo {
  font-size: 18px;
  font-weight: bold;
  text-transform: capitalize;
}

.toggle-wrapper {
  display: flex;
  background: #e0e0e0;
  border-radius: 10px 20px 10px 10px ;
}

.toggle-btn {
  width: 110px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.toggle-btn.ativo {
  background: #00b894;
  color: #fff;
  border-radius: 10px 20px 10px 10px;
}


select {
  justify-self: end;
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
}


.barra-dias {
  padding-top: 15px;
  display: flex;
  gap: 35px;
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 5;
  padding-bottom: 8px;
}

.espaco-horarios {
  width: 80px;
  flex-shrink: 0;
}

.chips {
  display: flex;
  gap: 18px;
  overflow-x: auto;
  flex: 1;
}

.chip-dia {
  min-width: 140px;
  height: 36px;
  background: #ededed;
  border-radius: 10px 20px 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.chip-dia.hoje {
  background: #00b894;
  color: #fff;
}
.conteudo {
  padding: 0 16px 16px; 
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.grade {
  display: flex;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  border-top: 1px solid #ddd;
}
.grade-conteudo {
  display: flex;
  min-width: max-content; 
}


.grade.modo-hoje .dias {
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(100px - 1px),
    #e0e0e0 calc(100px - 1px),
    #e0e0e0 100px
  );
  background-size: 100% 100px;
  min-width: 1280px;
}


.horarios {
  width: 80px;
}

.hora {
  height: 100px;
  font-size: 13px;
  line-height: 15px;
  color: #666;
}

.dias {
  display: flex;
  min-width: max-content; 
  min-height: calc((23 - 6) * 100px);
  position: relative;
}


.dia {
  min-width: 160px;
}

.coluna-eventos {
  position: relative;
}

.evento-grupo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.evento {
  position: absolute;
  border-radius: 10px;
  padding: 6px;
  font-size: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08),
              inset 0 0 0 1px rgba(255,255,255,0.5);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #fff;
}

.conteudo-evento {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.titulo-evento {
  font-size: 13px;
  font-weight: bold;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.local-evento {
  font-size: 11px;
  opacity: 0.8;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.horario-evento {
  font-size: 10px;
  opacity: 0.7;
}


.evento:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 14px rgba(0, 0, 0, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}


.acoes-direita {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-self: end;
  margin-left: -15px; 
}

.icon-btn {
  border: none;
  background: #e0e0e0;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;
}
.icon-btn img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  transition: filter 0.2s ease;
}
.icon-btn:hover {
  background: #c8f0e1;
}

.icon-btn.ativo img {
  filter: brightness(0) saturate(100%) invert(47%) sepia(96%)
    saturate(402%) hue-rotate(104deg) brightness(92%) contrast(90%);
}



.lista {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.item-lista {
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}

.badge {
  background: #00b894;
  color: #fff;
  padding: 6px 12px;
  border-radius: 10px;
  min-width: 180px;
}

.info {
  display: flex;
  justify-content: space-between;
  flex: 1;
  font-size: 14px;
}

.mais-eventos {
  position: absolute;
  right: 6px;
  bottom: 6px;
  font-size: 11px;
  background: rgba(0,0,0,0.15);
  padding: 2px 6px;
  border-radius: 6px;
  cursor: pointer;
}

.lista-oculta {
  margin-top: 6px;
  font-size: 11px;
  background: rgba(255,255,255,0.7);
  padding: 4px;
  border-radius: 6px;
}
.nav-semana {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn {
  border: none;
  background: #e0e0e0;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.nav-btn:hover {
  background: #c8f0e1;
}

</style>
