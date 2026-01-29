<script setup lang="ts">
import { ref, computed } from 'vue'

// Seus imports de imagem (mantidos)
import iconLista from '@/assets/iconLista.png'
import iconCalendario from '@/assets/iconCalendario.png'
import iconLocal from '@/assets/iconLocal.png'
import iconHorario from '@/assets/iconHorario.png'

type Modo = 'hoje' | 'semana'
type Tipo = 'calendario' | 'lista'

interface Evento {
  titulo: string
  dataInscricaoInicio?: string
  dataInscricaoFim?: string
  dataEventoInicio?: string
  dataEventoFim: string
  categorias: string[]
  local: string
}

const props = defineProps<{
  eventos: Evento[],
}>()

const hoje = new Date()

const modoVisualizacao = ref<Modo>('semana')
const tipoVisualizacao = ref<Tipo>('calendario')
const categoriaSelecionada = ref('Todas')
const dataBaseAgenda = ref(new Date(hoje))

const separarDataHora = (dataISO?: string) => {
  if (!dataISO) return { data: '--/--/--', hora: '--:--' }

  const dataObj = new Date(dataISO)
  const dataFormatada = dataObj.toLocaleDateString('pt-BR')
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return { data: dataFormatada, hora: horaFormatada }
}

const estaNoIntervalo = (dia: Date, inicioISO?: string, fimISO?: string) => {
  if (!inicioISO || !fimISO) return false

  const d = new Date(dia)
  d.setHours(0, 0, 0, 0)

  const start = new Date(inicioISO)
  start.setHours(0, 0, 0, 0)

  const end = new Date(fimISO)
  end.setHours(23, 59, 59, 999)

  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime()
}

const diasSemana = computed(() => {
  const inicio = new Date(dataBaseAgenda.value)

  inicio.setDate(inicio.getDate() - inicio.getDay())

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    return d
  })
})

const mesAnoAtual = computed(() => {
  const base =
    modoVisualizacao.value === 'hoje' ? hoje : (diasSemana.value[0] ?? dataBaseAgenda.value)

  const mes = base.toLocaleDateString('pt-BR', { month: 'long' })
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1)
  const ano = base.getFullYear()

  return `${mesCapitalizado}, ${ano}`
})

//CATEGORIAS

const categorias = computed(() => {
  // flatMap: pega os arrays ['A', 'B'] e ['C', 'A'] e transforma em ['A', 'B', 'C', 'A']
  const todas = props.eventos.flatMap(e => e.categorias)
  return ['Todas', ...new Set(todas)]
})

const coresCategorias = computed<Record<string, string>>(() => {
  // Pega categorias únicas (sem 'Todas') para gerar cores
  const catsUnicas = [...new Set(props.eventos.flatMap(e => e.categorias))]
  
  return Object.fromEntries(
    catsUnicas.map((c, i) => {
      const cor = c === 'Geral' ? 'hsl(210, 15%, 60%)' : `hsl(145, 45%, ${78 - (i % 5) * 6}%)` // o % 5 evita que a cor fique preta se houver muitas cats

      return [c, cor]
    }),
  )
})

const eventosFiltrados = (dia: Date) =>
  props.eventos
    .filter((e) => {
      const matchCategoria =
        categoriaSelecionada.value === 'Todas' || e.categorias.includes(categoriaSelecionada.value)

      const matchData = estaNoIntervalo(dia, e.dataEventoInicio, e.dataEventoFim)

      return matchCategoria && matchData
    })
    .sort((a, b) => {
      return (a.dataEventoInicio || '').localeCompare(b.dataEventoInicio || '')
    })

const eventosLista = computed(() =>
  props.eventos.filter((e) => {
    // 1. Filtro de Categoria
    if (categoriaSelecionada.value !== 'Todas' && !e.categorias.includes(categoriaSelecionada.value)) {
      return false
    }

    if (modoVisualizacao.value === 'hoje') {
      return estaNoIntervalo(hoje, e.dataEventoInicio, e.dataEventoFim)
    } else {
      return diasSemana.value.some((d) => estaNoIntervalo(d, e.dataEventoInicio, e.dataEventoFim))
    }
  }),
)

const semanaAnterior = () => {
  const novaData = new Date(dataBaseAgenda.value)
  novaData.setDate(novaData.getDate() - 7)
  dataBaseAgenda.value = novaData
}

const proximaSemana = () => {
  const novaData = new Date(dataBaseAgenda.value)
  novaData.setDate(novaData.getDate() + 7)
  dataBaseAgenda.value = novaData
}

// Primeira categoria ou 'Geral' se vazio
const getPrimeiraCategoria = (categorias: string[]) => {
  return categorias?.[0] ?? 'Geral'
}

// Definir o ícone
const getIconPath = (categoria: string) => {
  const categoryMap: Record<string, string> = {
    Palestras: 'palestras.svg',
    Cultura: 'cultura.svg',
    Esporte: 'esporte.svg',
    Tecnologia: 'tecnologia.svg',
    Saúde: 'saude.svg',
  }

  const fileName = categoryMap[categoria] || 'default.svg'
  return `/src/assets/images/icons/${fileName}`
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
    <div id="scroll">
      <div class="barra-dias">
        <div class="chips">
          <div
            v-for="dia in modoVisualizacao === 'hoje' ? [hoje] : diasSemana"
            :key="dia.toDateString()"
            class="chip-dia"
            :class="{ hoje: dia.toDateString() === hoje.toDateString() }"
          >
            <span class="numero">{{ dia.getDate() }}</span>
            <span class="semana">
              {{ dia.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase() }}
            </span>
          </div>
        </div>
      </div>
      <div class="conteudo">
        <div v-if="tipoVisualizacao === 'lista'" class="lista">
          <div
            v-for="evento in eventos"
            :key="evento.titulo + evento.dataEventoInicio + evento.dataEventoFim"
            class="item-lista"
          >
            <div class="badge">{{ evento.titulo }}</div>

            <div class="info">
              <strong
                >{{ separarDataHora(evento.dataEventoInicio).data }} até
                {{ separarDataHora(evento.dataEventoFim).data }}</strong
              >
              <span>{{ evento.local }}</span>
            </div>
          </div>
        </div>

        <div v-else class="grade" :class="{ 'modo-hoje': modoVisualizacao === 'hoje' }">
          <div class="grade-conteudo">
            <div class="dias">
              <div
                v-for="dia in modoVisualizacao === 'hoje' ? [hoje] : diasSemana"
                :key="dia.toDateString()"
                class="dia"
              >
                <div
                  v-for="evento in eventosFiltrados(dia)"
                  :key="evento.titulo + evento.dataEventoInicio"
                  class="evento-simples"
                  :style="{ background: coresCategorias[getPrimeiraCategoria(evento.categorias)] }"
                >
                  <div class="evento-header">
                    <strong class="titulo-evento">{{ evento.titulo }}</strong>
                  </div>

                  <div class="evento-info local-evento">
                    <img :src="iconLocal" alt="Local" class="icon-info" />
                    <span>{{ evento.local }}</span>
                  </div>

                  <div class="evento-info horario-evento">
                    <img :src="iconHorario" alt="Horário" class="icon-info" />
                    <span
                      >{{ separarDataHora(evento.dataEventoInicio).hora }} às
                      {{ separarDataHora(evento.dataEventoFim).hora }}</span
                    >
                  </div>
                </div>
                <p v-if="!eventosFiltrados(dia).length" class="dia-vazio">Nenhum evento</p>
              </div>
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
  max-width: 1400px;
  max-height: 800px;
  margin: 0 auto;
  display: flex;
  overflow-x: visible;
  overflow-y: hidden;
  flex-direction: column;
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
  padding-top: 19px;
  display: flex;
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 5;
  padding-bottom: 8px;
}

.chips {
  display: flex;
  gap: 14px;
  margin-left: 20px;
  flex: 1;
}

.chip-dia {
  min-width: 175px;
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
}

.grade {
  display: flex;
  flex: 1;
  overflow-y: auto;
  border-top: 1px solid #ddd;
}

.grade-conteudo {
  display: flex;
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

.grade.modo-hoje .dia {
  min-width: 420px;
  padding: 16px;
  min-height: 600px;
}

.dias {
  display: flex;
  max-width: 180px;
  width: 100%;
  min-height: calc((23 - 6) * 40px);
  position: relative;
  gap: 10px;
}

.dia {
  min-width: 0;
  max-width: 100%;
  padding: 8px 0;
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
}

.evento-header {
  background: rgba(0, 0, 0, 0.12);
  padding: 10px 12px;
}

.titulo-evento {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
  max-width: 100%;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  display: block;
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

.info {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #555;
}

.badge {
  background: #00b894;
  color: #fff;
  padding: 15px 12px;
  border-radius: 15px;
  min-width: 380px;
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

.evento-info {
  margin: 5px 6px;
  padding: 6px 10px;
  font-size: 12px;
  display: flex;
  line-height: 1.2;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background-clip: padding-box;
}

.icon-info {
  width: 14px;
  height: 14px;
  display: block;
  margin-top: -1px;
  flex-shrink: 0;
}

.evento-info span {
  line-height: 1;
  display: block;
}

.local-evento {
  background: rgba(76, 220, 93, 0.25);
}

.horario-evento {
  background: rgba(8, 152, 39, 0.18);
}

.evento-simples {
  padding: 0;
  border-radius: 12px;
  gap: 0;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  min-height: 120px;
  height: auto;
  overflow: hidden;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  justify-content: flex-start;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  overflow-wrap: break-word;
  word-break: break-word;
}

.grade.modo-hoje .evento-simples {
  height: 180px;
  padding: 0;
  border-radius: 16px;
  gap: 6px;
  overflow: hidden;
}

.grade.modo-hoje .evento-header {
  padding: 14px 16px;
}

.grade.modo-hoje .titulo-evento {
  font-size: 20px;
  font-weight: 700;
}

.grade.modo-hoje .evento-info {
  padding: 10px 16px;
  font-size: 15px;
}

.grade.modo-hoje .local-evento {
  font-size: 17px;
  opacity: 0.9;
}

.grade.modo-hoje .horario-evento {
  font-size: 15px;
  font-weight: 600;
}

.grade.modo-hoje .evento-simples:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.grade.modo-hoje .dia-vazio {
  font-size: 14px;
  padding: 20px;
  opacity: 0.5;
  text-align: center;
}

.dia-vazio {
  font-size: 12px;
  opacity: 0.6;
  padding: 8px 30px;
}

@media (max-width: 1250px) {
  .toggle-wrapper {
    width: 100%;
    justify-content: center;
  }

  .toggle-btn {
    flex: 1;
  }

  .chips {
    gap: 14px;
    margin-left: 12px;
  }

  .chip-dia {
    min-width: 150px;
    width: 150px;
    height: 34px;
    flex-direction: column;
    gap: 2px;
    font-size: 9px;
    border-radius: 12px;
  }

  .chip-dia .numero {
    font-size: 10px;
    font-weight: bold;
  }

  .item-lista {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .info {
    width: 100%;
    font-size: 13px;
    flex-direction: column;
    gap: 4px;
  }

  .coluna-dias {
    overflow-y: hidden;
  }

  .dia {
    min-width: 140px;
    width: 140px;
  }
  .dias {
    gap: 22px;
  }
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
    min-width: 140px;
    width: 140px;
    height: 34px;
    flex-direction: column;
    gap: 2px;
    font-size: 9px;
    border-radius: 12px;
  }

  .chip-dia .numero {
    font-size: 10px;
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

  .coluna-dias {
    overflow-y: hidden;
  }

  .chips,
  .dias {
    width: max-content;
  }

  .dia {
    min-width: 180px;
    width: 180px;
  }

  .titulo-evento {
    font-size: 12px;
  }

  .local-evento,
  .horario-evento {
    font-size: 10px;
  }

  .grade-conteudo {
    overflow: visible;
  }

  #scroll {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .barra-dias,
  .grade {
    min-width: max-content;
  }

  .chips,
  .dias {
    display: flex;
    width: max-content;
  }

  .chip-dia,
  .dia {
    min-width: 140px;
    width: 140px;
    flex-shrink: 0;
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
