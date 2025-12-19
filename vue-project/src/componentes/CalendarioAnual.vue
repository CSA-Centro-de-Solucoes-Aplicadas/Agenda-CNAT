<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Evento {
  id: number
  nome: string
  dataInicio: string
  dataFim: string
}

const eventos = ref<Evento[]>([])

onMounted(() => {
  eventos.value = [
    {
      id: 1,
      nome: 'Evento alusivo ao dia do professor de geografia',
      dataInicio: '2025-12-09',
      dataFim: '2025-12-11',
    },
    {
      id: 2,
      nome: 'Palestra de conscientização ambiental 2025.2',
      dataInicio: '2025-12-11',
      dataFim: '2025-12-13',
    },
    {
      id: 3,
      nome: 'Palestra de tecnologia 2025.2',
      dataInicio: '2025-12-10',
      dataFim: '2025-12-15',
    },
    {
      id: 4,
      nome: 'FERIASSS(CADE AS FERIAS)',
      dataInicio: '2026-01-02',
      dataFim: '2026-01-20',
    },
  ]
})

const hoje = new Date()
const dataBase = ref(new Date(hoje.getFullYear(), hoje.getMonth()))

function proximo() {
  dataBase.value = new Date(dataBase.value.getFullYear(), dataBase.value.getMonth() + 2)
}

function anterior() {
  dataBase.value = new Date(dataBase.value.getFullYear(), dataBase.value.getMonth() - 2)
}

const legendaExpandida = ref<Record<number, boolean>>({})
function eventosVisiveis(ano: number, mes: number) {
  const lista = eventosDoMes(ano, mes)
  const chave = ano * 100 + mes

  if (legendaExpandida.value[chave]) {
    return lista
  }

  return lista.slice(0, 2)
}

function toggleLegenda(ano: number, mes: number) {
  const chave = ano * 100 + mes
  legendaExpandida.value[chave] = !legendaExpandida.value[chave]
}
function corDoEvento(ev: Evento) {
  return PALETA_CORES[ev.id % PALETA_CORES.length]
}

function eventosDoDia(data: Date | null): Evento[] {
  if (!data) return []

  return eventos.value.filter((ev) => {
    const inicio = criarDataLocal(ev.dataInicio)
    const fim = criarDataLocal(ev.dataFim)

    return data >= inicio && data <= fim
  })
}
function gradientePizza(eventosNoDia: Evento[]) {
  if (eventosNoDia.length === 0) return '#eef6f8'

  const cores = eventosNoDia
    .slice(0, 5) // máximo 5 cores
    .map(corDoEvento)

  const step = 360 / cores.length

  return `conic-gradient(${cores
    .map((cor, i) => {
      const start = i * step
      const end = (i + 1) * step
      return `${cor} ${start}deg ${end}deg`
    })
    .join(', ')})`
}

const PALETA_CORES = ['#57c083', '#5c95bb', '#e66070', '#f2a65a', '#9b6bcc']

function criarDataLocal(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

function gerarDiasDoMes(ano: number, mes: number) {
  const dias: (Date | null)[] = []

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay()
  const totalDias = new Date(ano, mes + 1, 0).getDate()

  for (let i = 0; i < primeiroDiaSemana; i++) {
    dias.push(null)
  }

  for (let i = 1; i <= totalDias; i++) {
    dias.push(new Date(ano, mes, i))
  }

  return dias
}

function tiposDiaEvento(data: Date | null): string[] {
  if (!data) return []

  const tipos = new Set<string>()

  for (const ev of eventos.value) {
    const inicio = criarDataLocal(ev.dataInicio)
    const fim = criarDataLocal(ev.dataFim)

    if (data.getTime() === inicio.getTime()) tipos.add('inicio')
    else if (data.getTime() === fim.getTime()) tipos.add('fim')
    else if (data > inicio && data < fim) tipos.add('meio')
  }

  return Array.from(tipos).slice(0, 3) // 🔒 no máximo 3 cores
}

function eventosDoMes(ano: number, mes: number) {
  return eventos.value.filter((ev) => {
    const ini = criarDataLocal(ev.dataInicio)
    const fim = criarDataLocal(ev.dataFim)

    return (
      (ini.getFullYear() === ano && ini.getMonth() === mes) ||
      (fim.getFullYear() === ano && fim.getMonth() === mes)
    )
  })
}

const meses = computed(() => {
  const m1 = dataBase.value
  const m2 = new Date(m1.getFullYear(), m1.getMonth() + 1)

  return [
    {
      ano: m1.getFullYear(),
      mes: m1.getMonth(),
      nome: m1.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      dias: gerarDiasDoMes(m1.getFullYear(), m1.getMonth()),
    },
    {
      ano: m2.getFullYear(),
      mes: m2.getMonth(),
      nome: m2.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      dias: gerarDiasDoMes(m2.getFullYear(), m2.getMonth()),
    },
  ]
})

function formatarData(data: string) {
  const [, m, d] = data.split('-')
  return `${d}/${m}`
}
</script>

<template>
  <div class="calendario">
    <section class="mes" v-for="(mes, index) in meses" :key="index">
      <div class="cabecalho">
        <button v-if="index === 0" @click="anterior">‹</button>
        <h3>{{ mes.nome }}</h3>
        <button v-if="index === 1" @click="proximo">›</button>
      </div>

      <div class="dias-semana">
        <span>D</span><span>S</span><span>T</span> <span>Q</span><span>Q</span><span>S</span
        ><span>S</span>
      </div>

      <div class="dias">
        <span v-for="(dia, i) in mes.dias" :key="i" class="dia">
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
          v-for="ev in eventosVisiveis(mes.ano, mes.mes)"
          :key="ev.id"
          :style="{ color: corDoEvento(ev) }"
        >
          <span class="data-inicio">{{ formatarData(ev.dataInicio) }}</span>
          <span class="ate"> até </span>
          <span class="data-fim">{{ formatarData(ev.dataFim) }}</span>
          <span class="traco"> – </span>
          <span class="nome-evento">{{ ev.nome }}</span>
        </p>

        <button
          v-if="eventosDoMes(mes.ano, mes.mes).length > 2"
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
  background: #fff;
  padding: 18px 82px;
  border-radius: 18px;
  max-width: 1100px;
  margin: 34px auto;

  flex-wrap: nowrap;
  justify-content: space-between;
}

.mes {
  width: 45%;
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
  background: #eef6f8;
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
  color: #fff;
}

.dia.inicio {
  background: #bfffda;
  color: #fff;
}

.dia.meio {
  background: #5c95bb;
  color: #fff;
}

.dia.fim {
  background: #e96060;
  color: #fff;
}

.legenda {
  margin-top: 10px;
  font-size: 15px;
  color: #007c91;
  line-height: 1.45;
}
/* .data-inicio {
  color: #2b8952;
  font-weight: 700;
}

.data-fim {
  color: #55186d; 
  font-weight: 700;
} */
.ate,
.traco {
  color: #007c91;
}

.nome-evento {
  color: #007c91;
}

.ver-mais {
  font-size: 7px;
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
}

@media (max-width: 480px) {
  .calendario {
    padding: 20px;
    gap: 16px;

    margin: 16px 12px;
    max-width: calc(100% - 24px);
  }

  .mes {
    width: 50%;
  }

  h3 {
    font-size: 10px;
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
    font-size: 8px;
  }

  button {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }

  .legenda {
    font-size: 7px;
  }
  .ver-mais {
    font-size: 7px;
  }
}
</style>
