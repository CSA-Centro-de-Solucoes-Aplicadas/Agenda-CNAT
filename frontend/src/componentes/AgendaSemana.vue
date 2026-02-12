<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import iconLista from '@/assets/iconLista.png'
import iconCalendario from '@/assets/iconCalendario.png'
import iconLocal from '@/assets/iconLocal.png'
import iconHorario from '@/assets/iconHorario.png'
import Modal from './Modal.vue'
import { fetchEventos, type PayloadEvento } from '@/services/api'

type Modo = 'hoje' | 'semana'
type Tipo = 'calendario' | 'lista'

interface Evento {
  titulo: string
  dataInicio: string
  dataFim: string
  inicio: string
  fim: string
  categoria: string
  local: string
  payloadEvento: PayloadEvento
}

const hoje = new Date()

const modoVisualizacao = ref<Modo>('semana')
const tipoVisualizacao = ref<Tipo>('calendario')
const categoriaSelecionada = ref('Todas')
const dataBaseAgenda = ref(new Date(hoje))
const dataSelecionada = ref<Date>(new Date(hoje))
const eventos = ref<Evento[]>([])
const eventosPayload = ref<PayloadEvento[]>([])
const eventoSelecionado = ref<PayloadEvento | null>(null)
const modalAberto = ref(false)

// Carrega os eventos da API e converte para o formato local
onMounted(async () => {
  try {
    const res = await fetchEventos({ limit: 200, where: { visivel: { equals: true } } })
    eventosPayload.value = res.docs
    eventos.value = res.docs.map(apiToLocal)
  } catch (err) {
    console.error('Erro ao carregar eventos da agenda:', err)
  }
})

function abrirModal(evento: Evento) {
  eventoSelecionado.value = evento.payloadEvento
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  eventoSelecionado.value = null
}

function apiToLocal(ev: PayloadEvento): Evento {
  const fmtLocal = (iso?: string | null): string => {
    if (!iso) return ''
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
  }
  const fmtTime = (iso?: string | null): string => {
    if (!iso) return '00:00'
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  return {
    titulo: ev.titulo,
    dataInicio: fmtLocal(ev.dataEventoInicio),
    dataFim: fmtLocal(ev.dataEventoFinal || ev.dataEventoInicio),
    inicio: fmtTime(ev.dataEventoInicio),
    fim: fmtTime(ev.dataEventoFinal),
    categoria: ev.categorias?.[0]?.nome || 'Geral',
    local: ev.local || '',
    payloadEvento: ev,
  }
}

const toDate = (d: string): Date => {
  const partes = d.split('-')
  if (partes.length !== 3) {
    throw new Error(`Data inválida: ${d}`)
  }

  const day = Number(partes[0])
  const month = Number(partes[1])
  const year = Number(partes[2])

  if ([day, month, year].some(isNaN)) {
    throw new Error(`Data inválida: ${d}`)
  }

  return new Date(year, month - 1, day)
}

const estaNoIntervalo = (dia: Date, inicio: string, fim: string) => {
  const base = new Date(dia)
  base.setHours(0, 0, 0, 0)
  const time = base.getTime()

  return time >= toDate(inicio).getTime() && time <= toDate(fim).getTime()
}


const diasSemana = computed(() => {
  const inicio = new Date(dataBaseAgenda.value)
  inicio.setDate(inicio.getDate() - ((inicio.getDay() + 6) % 7))

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    return d
  })
})

const diaAtual = computed(() => {
  return modoVisualizacao.value === 'hoje' ? dataSelecionada.value : hoje
})

const mesAnoAtual = computed(() => {
  const base =
    modoVisualizacao.value === 'hoje'
      ? diaAtual.value
      : diasSemana.value[0] ?? dataBaseAgenda.value

  const mes = base.toLocaleDateString('pt-BR', { month: 'long' })
  const ano = base.getFullYear()

  return `${mes}, ${ano}`
})

function alterarDia(dias: number) {
  const novaData = new Date(dataSelecionada.value)
  novaData.setDate(novaData.getDate() + dias)
  dataSelecionada.value = novaData
}

function onDateChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.value) {
    dataSelecionada.value = new Date(input.value + 'T00:00:00')
  }
}


const categorias = computed(() => [
  'Todas',
  ...new Set(eventos.value.map((e) => e.categoria)),
])

const coresCategorias = computed<Record<string, string>>(() => {
  return Object.fromEntries(
    [...new Set(eventos.value.map((e) => e.categoria))].map((c, i) => [
      c,
      `hsl(145, 45%, ${78 - i * 6}%)`,
    ]),
  )
})

const eventosFiltrados = (dia: Date) =>
  eventos.value
    .filter(
      (e) =>
        (categoriaSelecionada.value === 'Todas' ||
          e.categoria === categoriaSelecionada.value) &&
        estaNoIntervalo(dia, e.dataInicio, e.dataFim),
    )
    .sort((a, b) => a.inicio.localeCompare(b.inicio))

const eventosLista = computed(() =>
  eventos.value.filter((e) =>
    modoVisualizacao.value === 'hoje'
      ? estaNoIntervalo(diaAtual.value, e.dataInicio, e.dataFim)
      : diasSemana.value.some((d) =>
          estaNoIntervalo(d, e.dataInicio, e.dataFim),
        ),
  ),
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
</script>

<template>
  <div class="agenda">
    <header class="topo">
      <div class="nav-semana" v-if="modoVisualizacao === 'semana'">
        <button class="nav-btn" @click="semanaAnterior">◀</button>
        <h2 class="titulo">{{ mesAnoAtual }}</h2>
        <button class="nav-btn" @click="proximaSemana">▶</button>
      </div>
      
      <div class="nav-dia" v-else>
        <button class="nav-btn" @click="alterarDia(-1)">◀</button>
        <div class="date-picker-wrapper">
          <input 
            type="date" 
            :value="dataSelecionada.toISOString().split('T')[0]"
            @change="onDateChange"
            class="date-input"
          />
          <h2 class="titulo">{{ mesAnoAtual }}</h2>
        </div>
        <button class="nav-btn" @click="alterarDia(1)">▶</button>
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

    <!-- Dias -->
      <div class="dias-grade">
        <div class="barra-dias">
          <div class="chips">
            <div
              v-for="dia in modoVisualizacao === 'hoje' ? [diaAtual] : diasSemana"
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
              v-for="evento in eventosLista"
              :key="evento.titulo + evento.dataInicio + evento.dataFim"
              class="item-lista"
            >
              <div class="badge">{{ evento.titulo }}</div>

              <div class="info">
                <strong>{{ evento.dataInicio }} até {{ evento.dataFim }}</strong>
                <span>{{ evento.local }}</span>
              </div>
            </div>
          </div>


          <div v-else class="grade" :class="{ 'modo-hoje': modoVisualizacao === 'hoje' }">
            <div class="grade-conteudo">
              <div class="dias">
                <div
                  v-for="dia in modoVisualizacao === 'hoje' ? [diaAtual] : diasSemana"
                  :key="dia.toDateString()"
                  class="dia"
                >
                  <div
                    v-for="evento in eventosFiltrados(dia)"
                    :key="evento.titulo + evento.inicio"
                    class="evento-simples"
                    :style="{ background: coresCategorias[evento.categoria] }"
                    @click="abrirModal(evento)"
                  >
                
                    <div class="evento-header">
                      <strong class="titulo-evento">{{ evento.titulo }}</strong>
                      <span class="categoria-badge" v-if="modoVisualizacao === 'hoje'">{{ evento.categoria }}</span>
                    </div>


                    <div class="evento-info local-evento">
                      <img :src="iconLocal" alt="Local" class="icon-info" />
                      <span>{{ evento.local }}</span>
                    </div>

                  
                    <div class="evento-info horario-evento">
                      <img :src="iconHorario" alt="Horário" class="icon-info" />
                      <span>{{ evento.inicio }} às {{ evento.fim }}</span>
                    </div>
                    
                    <div v-if="modoVisualizacao === 'hoje' && evento.payloadEvento.descricao" class="evento-descricao">
                      {{ evento.payloadEvento.descricao.substring(0, 100) }}{{ evento.payloadEvento.descricao.length > 100 ? '...' : '' }}
                    </div>
                  </div>
              <p v-if="!eventosFiltrados(dia).length" class="dia-vazio">
                Nenhum evento
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    
    <Modal
      v-if="modalAberto && eventoSelecionado"
      :evento="eventoSelecionado"
      @close="fecharModal"
    />
  </div>
</template>


<style scoped>
.agenda {
  background: #ffffff;
  padding: 0px;
  border-radius: 20px;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  height: auto;
  min-height: 600px;
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

.nav-dia {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-picker-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.date-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.date-picker-wrapper .titulo {
  position: relative;
  z-index: 1;
  pointer-events: none;
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
  min-height: 500px;
  height: auto;
}

.grade {
  display: flex;
  flex: 1;
  height: auto;
  min-height: 500px;
  border-top: 1px solid #ddd;
}
.grade-conteudo {
  display: flex;
  min-width: 100%;
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
  min-height: auto;
}

.dias {
  display: flex;
  min-width: 100%;
  position: relative;
  gap: 10px;
  align-items: flex-start;
}

.dia {
  min-width: 0;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  padding: 8px 0;
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  min-height: 400px;
}
.evento-header {
  background: rgba(0, 0, 0, 0.12);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.categoria-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.25);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  align-self: flex-start;
}

.evento-descricao {
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.4;
  background: rgba(0, 0, 0, 0.08);
  color: #fff;
  opacity: 0.95;
}

.evento-simples:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.25),
    inset 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.evento-simples:active {
  transform: translateY(-2px) scale(0.98);
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.2),
    inset 0 0 0 2px rgba(255, 255, 255, 0.4);
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
  border-radius: 16px;
  gap: 0;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  min-height: 140px;
  height: auto;
  overflow: hidden;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  justify-content: flex-start;
  cursor: pointer;
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-wrap: break-word;
  word-break: break-word;
  position: relative;
}


.grade.modo-hoje .evento-simples {
  min-height: 200px;
  height: auto;
  padding:0;
  border-radius: 16px;
  gap: 0;
  overflow: hidden;
}
.grade.modo-hoje .evento-header {
  padding: 14px 16px;
  gap: 8px;
}
.grade.modo-hoje .titulo-evento {
  font-size: 20px;
  font-weight: 700;
}
.grade.modo-hoje .categoria-badge {
  font-size: 12px;
  padding: 5px 12px;
}
.grade.modo-hoje .evento-info {
  padding: 10px 16px;
  font-size: 15px;
  margin: 0;
}
.grade.modo-hoje .local-evento {
  font-size: 16px;
  opacity: 0.9;
}

.grade.modo-hoje .horario-evento {
  font-size: 15px;
  font-weight: 600;
}

.grade.modo-hoje .evento-descricao {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
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
 /* .dias, .grade{
    overflow: visible;
    
  } */
.coluna-dias {
    overflow-y: hidden;
  
  }
  .chips,
  .dias {
    width: max-content;
  }

  .dia {
    min-width: 140px;
    width: 140px;
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
  .barra-dias {
    overflow-y: hidden;
  }
  .grade-conteudo {
    overflow: visible;
  }
   
    /* Container principal com scroll */
  .agenda {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .barra-dias {
    overflow-x: visible;
  }
  
  .grade {
    overflow-x: visible;
  }
  
  .grade-conteudo {
    overflow-x: visible;
  }

  /* Chips e dias com mesma largura fixa */
  .chips {
    display: flex;
    gap: 10px;
    min-width: calc(140px * 7 + 60px); /* 7 dias + gaps */
  }
  
  .dias {
    display: flex;
    gap: 10px;
    min-width: calc(140px * 7 + 60px); /* 7 dias + gaps */
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