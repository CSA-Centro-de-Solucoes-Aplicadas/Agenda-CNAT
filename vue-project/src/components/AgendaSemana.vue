<script setup lang="ts">
import { ref, computed } from 'vue'
import iconLista from '@/assets/iconLista.png'
import iconCalendario from '@/assets/iconCalendario.png'

/* ================= ESTADOS DE VISUALIZAÇÃO ================= */
const modoVisualizacao = ref<'hoje' | 'semana'>('semana')
const tipoVisualizacao = ref<'calendario' | 'lista'>('calendario')
const categoriaSelecionada = ref('Todas')

/* ================= INTERFACE ================= */
interface Evento {
  titulo: string
  dataInicio: string // dd-mm-yyyy
  dataFim: string    // dd-mm-yyyy
  inicio: string
  fim: string
  categoria: string
  local: string
}

/* ================= EVENTOS ================= */
const eventos = ref<Evento[]>([
  {
    titulo: 'Arraiá Junino',
    dataInicio: '15-12-2025',
    dataFim: '16-12-2025',
    inicio: '07:00',
    fim: '11:00',
    categoria: 'Cultura',
    local: 'Ginásio',
  },
  {
    titulo: 'Winfo',
    dataInicio: '15-12-2025',
    dataFim: '18-12-2025',
    inicio: '06:00',
    fim: '11:00',
    categoria: 'Tecnologia',
    local: 'Biblioteca',
  },
  {
    titulo: 'Wtads',
    dataInicio: '15-12-2025',
    dataFim: '18-12-2025',
    inicio: '06:00',
    fim: '11:00',
    categoria: 'Palestra',
    local: 'Biblioteca',
  },
  {
    titulo: 'Jogos internos',
    dataInicio: '15-12-2025',
    dataFim: '18-12-2025',
    inicio: '06:00',
    fim: '11:00',
    categoria: 'Esporte',
    local: 'Biblioteca',
  },
])

/* ================= DATAS ================= */

// hoje real (NUNCA MUDA)
const hojeReal = new Date()

// data de navegação (semana atual / próxima / anterior)
const dataBaseAgenda = ref(new Date(hojeReal))

function parseData(data: string): Date {
  const partes = data.split('-')

  if (partes.length !== 3) {
    throw new Error(`Data inválida: ${data}`)
  }

  const d = Number(partes[0])
  const m = Number(partes[1])
  const y = Number(partes[2])

  if (isNaN(d) || isNaN(m) || isNaN(y)) {
    throw new Error(`Data inválida: ${data}`)
  }

  return new Date(y, m - 1, d)
}


function estaEntreDatas(dia: Date, inicio: string, fim: string) {
  const d = new Date(dia).setHours(0, 0, 0, 0)
  const di = parseData(inicio).getTime()
  const df = parseData(fim).getTime()
  return d >= di && d <= df
}

function formatarData(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}-${m}-${y}`
}

/* ================= SEMANA ================= */
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

/* ================= MÊS / ANO ================= */
const mesAnoAtual = computed(() => {
 const base =
  modoVisualizacao.value === 'hoje'
    ? hojeReal
    : diasSemana.value[0] ?? dataBaseAgenda.value


  const mes = base.toLocaleDateString('pt-BR', { month: 'long' })
  const ano = base.getFullYear()

  return `${mes}, ${ano}`
})

/* ================= CATEGORIAS ================= */
const categorias = computed(() => {
  const unicas = new Set(eventos.value.map(e => e.categoria))
  return ['Todas', ...unicas]
})

const coresCategorias = computed<Record<string, string>>(() => {
  const unicas = Array.from(new Set(eventos.value.map(e => e.categoria)))

  const baseHue = 145
  const saturation = 45
  const lightnessBase = 78

  const mapa: Record<string, string> = {}

  unicas.forEach((cat, index) => {
    mapa[cat] = `hsl(${baseHue}, ${saturation}%, ${lightnessBase - index * 6}%)`
  })

  return mapa
})

/* ================= EVENTOS DO DIA ================= */
function eventosDoDiaOrdenados(data: Date) {
  return eventos.value
    .filter(e => {
      const categoriaOk =
        categoriaSelecionada.value === 'Todas' ||
        e.categoria === categoriaSelecionada.value

      const dataOk = estaEntreDatas(
        data,
        e.dataInicio,
        e.dataFim
      )

      return categoriaOk && dataOk
    })
    .sort((a, b) => a.inicio.localeCompare(b.inicio))
}

/* ================= LISTA ================= */
const eventosLista = computed(() => {
  return eventos.value.filter(e => {
    const categoriaOk =
      categoriaSelecionada.value === 'Todas' ||
      e.categoria === categoriaSelecionada.value

    const dataOk =
      modoVisualizacao.value === 'hoje'
        ? estaEntreDatas(
            hojeReal,
            e.dataInicio,
            e.dataFim
          )
        : diasSemana.value.some(d =>
            estaEntreDatas(d, e.dataInicio, e.dataFim)
          )

    return categoriaOk && dataOk
  })
})

/* ================= NAVEGAÇÃO ================= */
function semanaAnterior() {
  dataBaseAgenda.value = new Date(
    dataBaseAgenda.value.setDate(dataBaseAgenda.value.getDate() - 7)
  )
}

function proximaSemana() {
  dataBaseAgenda.value = new Date(
    dataBaseAgenda.value.setDate(dataBaseAgenda.value.getDate() + 7)
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
    <div class="barra-dias">

      <div class="chips">
        <div
          v-for="dia in modoVisualizacao === 'hoje' ? [hojeReal] : diasSemana"
          :key="dia.toDateString()"
          class="chip-dia"
          :class="{ hoje: formatarData(dia) === formatarData(hojeReal) }"

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
          v-for="evento in eventosLista"
          :key="evento.titulo + evento.dataInicio + evento.dataFim"
          class="item-lista"
        >
          <div class="badge">{{ evento.titulo }}</div>

          <div class="info">
            <strong>
              {{ evento.dataInicio }} até {{ evento.dataFim }}
            </strong>

            <span>{{ evento.local }}</span>
          </div>
        </div>
      </div>

          <!-- CALENDÁRIO -->
          <div v-else class="grade" :class="{ 'modo-hoje': modoVisualizacao === 'hoje' }">
            <div class="grade-conteudo">


            <div class="dias">
                <div
                  v-for="dia in modoVisualizacao === 'hoje'
                    ? [hojeReal]
                    : diasSemana"
                  :key="dia.toDateString()"
                  class="dia"
                >
                  <div
                    v-for="evento in eventosDoDiaOrdenados(dia)"
                    :key="evento.titulo + evento.inicio"
                    class="evento-simples"
                    :style="{ background: coresCategorias[evento.categoria] }"
                  >
                    <strong class="titulo-evento">{{ evento.titulo }}</strong>
                    <small class="local-evento">{{ evento.local }}</small>
                    <span class="horario-evento">
                      {{ evento.inicio }} às {{ evento.fim }}
                    </span>
                  </div>

                  <p
                    v-if="!eventosDoDiaOrdenados(dia).length"
                    class="dia-vazio"
                  >
                    Nenhum evento
                  </p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
  
.agenda {
  background: #ffffff;
  padding: 0px;
  border-radius: 20px;
  max-width: 1300px;        
  max-height: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: sans-serif;
}

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
  border-radius: 10px 20px 10px 10px;
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
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 5;
  padding-bottom: 8px;
}

.chips {
  display: flex;
  gap: 19px;
  margin-left: 20px;
  overflow-x: auto;
  flex: 1;
}

.chip-dia {
  min-width: 160px;
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
  flex: 1;
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


.dias {
  display: flex;
  min-width: max-content;
  min-height: calc((23 - 6) * 30px);
  position: relative;
}

.dia {
  min-width: 180px;        /* AQUI o card cresce */
  padding: 8px 0;          /* sem padding lateral */
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}


.coluna-eventos {
  position: relative;
  
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

.evento-simples:hover {
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
  filter: brightness(0) saturate(100%) invert(47%) sepia(96%) saturate(402%) hue-rotate(104deg)
    brightness(92%) contrast(90%);
}

.lista {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}

.item-lista {
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.badge {
  background: #00b894;
  color: #fff;
  padding: 15px 12px;
  border-radius: 15px;
  min-width: 380px;
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
  background: rgba(0, 0, 0, 0.15);
  padding: 2px 6px;
  border-radius: 6px;
  cursor: pointer;
}

.lista-oculta {
  margin-top: 6px;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.7);
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

.dia {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.evento-simples {
  width: 100%;
  box-sizing: border-box;
  height: 80px;
  border-radius: 10px;
  padding: 8px 10px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.dia-vazio {
  font-size: 12px;
  opacity: 0.6;
  padding: 8px 4px;
}
@media (max-width: 768px) {

  .topo {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }

  .nav-semana {
    justify-content: space-between;
  }

  .titulo {
    font-size: 16px;
    text-align: center;
    flex: 1;
  }

  .toggle-wrapper {
    width: 100%;
    justify-content: center;
  }

  .toggle-btn {
    flex: 1;
  }

  .acoes-direita {
    justify-content: space-between;
    margin-left: 0;
    gap: 12px;
  }

  select {
    flex: 1;
  }
   .chips {
    gap: 10px;
    margin-left: 12px;
  }

  .chip-dia {
    min-width: 72px;
    height: 48px;
    flex-direction: column;
    gap: 2px;
    font-size: 11px;
    border-radius: 12px;
  }

  .chip-dia .numero {
    font-size: 16px;
    font-weight: bold;
  }
   .item-lista {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .badge {
    min-width: unset;
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
    border-radius: 10px;
  }

  .info {
    width: 100%;
    font-size: 13px;
    flex-direction: column;
    gap: 4px;
  }
  .grade {
    overflow-x: auto;
  }

  .dia {
    min-width: 140px;
    padding: 6px;
  }

  .evento-simples {
    height: auto;
    padding: 6px 8px;
  }

  .titulo-evento {
    font-size: 12px;
  }

  .local-evento,
  .horario-evento {
    font-size: 10px;
  }
}
@media (max-width: 420px) {
  .titulo {
    font-size: 14px;
  }

  .chip-dia {
    min-width: 64px;
  }

  .toggle-btn {
    font-size: 12px;
  }
}

</style>
