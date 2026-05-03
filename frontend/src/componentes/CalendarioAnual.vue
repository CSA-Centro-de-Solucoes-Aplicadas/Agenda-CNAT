<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import type { EventRecord } from '@/types/event'

interface EventoCalendario {
  id: string
  nome: string
  dataInicio: string
  dataFim: string
}

const props = defineProps<{
  eventos: EventRecord[]
}>()

const hoje = new Date()
const dataBase = ref(new Date(hoje.getFullYear(), hoje.getMonth()))
const isMobile = ref(false)
const legendaExpandida = ref<Record<number, boolean>>({})
const PALETA_CORES = ['#57c083', '#5c95bb', '#e66070', '#f2a65a', '#9b6bcc']

const eventos = computed(() => props.eventos.map(eventToCalendar))

function eventToCalendar(event: EventRecord): EventoCalendario {
  return {
    id: event.id,
    nome: event.titulo,
    dataInicio: formatIsoDate(event.dataEventoInicio),
    dataFim: formatIsoDate(event.dataEventoFim || event.dataEventoInicio),
  }
}

function formatIsoDate(iso?: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function verificarTela() {
  isMobile.value = window.innerWidth <= 480
}

onMounted(() => {
  verificarTela()
  window.addEventListener('resize', verificarTela)
})

function proximo() {
  const passo = isMobile.value ? 1 : 2
  dataBase.value = new Date(dataBase.value.getFullYear(), dataBase.value.getMonth() + passo)
}

function anterior() {
  const passo = isMobile.value ? 1 : 2
  dataBase.value = new Date(dataBase.value.getFullYear(), dataBase.value.getMonth() - passo)
}

function eventosVisiveis(ano: number, mes: number) {
  const lista = eventosDoMes(ano, mes)
  const chave = ano * 100 + mes

  if (legendaExpandida.value[chave]) return lista
  return lista.slice(0, 2)
}

function toggleLegenda(ano: number, mes: number) {
  const chave = ano * 100 + mes
  legendaExpandida.value[chave] = !legendaExpandida.value[chave]
}

function corDoEvento(event: EventoCalendario) {
  return PALETA_CORES[indiceDoEvento(event.id) % PALETA_CORES.length]
}

function indiceDoEvento(id: string) {
  return Array.from(id).reduce((total, char) => total + char.charCodeAt(0), 0)
}

function eventosDoDia(data: Date | null): EventoCalendario[] {
  if (!data) return []

  return eventos.value.filter((event) => {
    const inicio = criarDataLocal(event.dataInicio)
    const fim = criarDataLocal(event.dataFim)
    return data >= inicio && data <= fim
  })
}

function gradientePizza(eventosNoDia: EventoCalendario[]) {
  if (eventosNoDia.length === 0) return '#efeded'

  const cores = eventosNoDia.slice(0, 5).map(corDoEvento)
  const step = 360 / cores.length

  return `conic-gradient(${cores
    .map((cor, index) => `${cor} ${index * step}deg ${(index + 1) * step}deg`)
    .join(', ')})`
}

function criarDataLocal(data: string) {
  const [ano = 0, mes = 1, dia = 1] = data.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

function gerarDiasDoMes(ano: number, mes: number) {
  const dias: (Date | null)[] = []
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay()
  const totalDias = new Date(ano, mes + 1, 0).getDate()

  for (let index = 0; index < primeiroDiaSemana; index++) dias.push(null)
  for (let dia = 1; dia <= totalDias; dia++) dias.push(new Date(ano, mes, dia))

  return dias
}

function eventosDoMes(ano: number, mes: number) {
  return eventos.value.filter((event) => {
    const inicio = criarDataLocal(event.dataInicio)
    const fim = criarDataLocal(event.dataFim)

    return (
      (inicio.getFullYear() === ano && inicio.getMonth() === mes) ||
      (fim.getFullYear() === ano && fim.getMonth() === mes)
    )
  })
}

const meses = computed(() => {
  const formatarMesAno = (data: Date) => {
    const mes = data.toLocaleDateString('pt-BR', { month: 'long' })
    return `${mes}, ${data.getFullYear()}`
  }

  const mesAtual = dataBase.value
  const lista = [
    {
      ano: mesAtual.getFullYear(),
      mes: mesAtual.getMonth(),
      nome: formatarMesAno(mesAtual),
      dias: gerarDiasDoMes(mesAtual.getFullYear(), mesAtual.getMonth()),
    },
  ]

  if (!isMobile.value) {
    const proximoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1)
    lista.push({
      ano: proximoMes.getFullYear(),
      mes: proximoMes.getMonth(),
      nome: formatarMesAno(proximoMes),
      dias: gerarDiasDoMes(proximoMes.getFullYear(), proximoMes.getMonth()),
    })
  }

  return lista
})

function formatarData(data: string) {
  const [, mes = '--', dia = '--'] = data.split('-')
  return `${dia}/${mes}`
}
</script>

<template>
  <div class="calendario">
    <section v-for="(mes, index) in meses" :key="`${mes.ano}-${mes.mes}`" class="mes">
      <div class="cabecalho">
        <button v-if="index === 0" type="button" @click="anterior">
          ‹
        </button>

        <h3>{{ mes.nome }}</h3>

        <button v-if="(!isMobile && index === 1) || isMobile" type="button" @click="proximo">
          ›
        </button>
      </div>

      <div class="dias-semana">
        <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
      </div>

      <div class="dias">
        <span v-for="(dia, diaIndex) in mes.dias" :key="diaIndex" class="dia">
          <span
            v-if="dia"
            class="dia-bg"
            :style="{ background: gradientePizza(eventosDoDia(dia)) }"
          ></span>

          <span class="dia-numero">{{ dia ? dia.getDate() : '' }}</span>
        </span>
      </div>

      <div class="legenda">
        <p
          v-for="event in eventosVisiveis(mes.ano, mes.mes)"
          :key="event.id"
          :style="{ color: corDoEvento(event) }"
        >
          <span class="data-inicio">{{ formatarData(event.dataInicio) }}</span>
          <span class="ate"> até </span>
          <span class="data-fim">{{ formatarData(event.dataFim) }}</span>
          <span class="traco"> - </span>
          <span class="nome-evento">{{ event.nome }}</span>
        </p>

        <button
          v-if="eventosDoMes(mes.ano, mes.mes).length > 2"
          type="button"
          class="ver-mais"
          @click="toggleLegenda(mes.ano, mes.mes)"
        >
          {{ legendaExpandida[mes.ano * 100 + mes.mes] ? 'Ver menos' : 'Ver mais' }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.calendario {
  display: flex;
  gap: 24px;
  background: #ffffff;
  padding: 18px 82px;
  border-radius: 18px;
  max-width: 1100px;
  margin: 34px auto;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.mes {
  width: 50%;
  max-width: 400px;
}

.cabecalho {
  display: flex;
  align-items: center;
  gap: 6px;
}

h3 {
  flex: 1;
  text-align: center;
  text-transform: capitalize;
  font-size: 18px;
  font-weight: 600;
}

button {
  background: #f1f3f4;
  border: none;
  font-size: 22px;
  cursor: pointer;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dias-semana,
.dias {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.dias-semana {
  font-weight: 600;
  font-size: 14px;
  margin: 10px 0;
  color: #555;
}

.dias {
  gap: 8px;
}

.dia {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.dia-bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.dia-numero {
  position: relative;
  z-index: 2;
  color: #ffffff;
}

.legenda {
  margin-top: 10px;
  font-size: 15px;
  color: #007c91;
  line-height: 1.45;
}

.ate,
.traco,
.nome-evento {
  color: #007c91;
}

.legenda p {
  margin-bottom: 4px;
}

.ver-mais {
  background: none;
  border: none;
  padding: 0;
  margin-top: 4px;
  font-size: 15px;
  color: #3498db;
  cursor: pointer;
  font-weight: 600;
  width: auto;
  height: auto;
  border-radius: 0;
}

@media (max-width: 680px) {
  .calendario {
    padding: 50px;
    gap: 16px;
    margin: 16px 12px;
    max-width: calc(100% - 24px);
  }

  .mes {
    width: 100%;
  }

  h3 {
    font-size: 15px;
    font-weight: 700;
    line-height: 1.2;
  }

  .dias-semana {
    font-size: 10px;
  }

  .dias {
    gap: 4px;
  }

  .dia {
    font-size: 10px;
  }

  button {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }

  .legenda {
    font-size: 14px;
  }

  .ver-mais {
    font-size: 10px;
  }
}
</style>
