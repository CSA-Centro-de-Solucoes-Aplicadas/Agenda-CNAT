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
      dataInicio: '2025-12-02',
      dataFim: '2025-12-03'
    },
    {
      id: 2,
      nome: 'Palestra de conscientização ambiental 2025.2',
      dataInicio: '2025-12-05',
      dataFim: '2025-12-07'
    },
    {
      id: 3,
      nome: 'Palestra de tecnologia 2025.2',
      dataInicio: '2025-12-10',
      dataFim: '2025-12-15'
    }
  ]
})


const hoje = new Date()
const dataBase = ref(new Date(hoje.getFullYear(), hoje.getMonth()))

function proximo() {
  dataBase.value = new Date(
    dataBase.value.getFullYear(),
    dataBase.value.getMonth() + 2
  )
}

function anterior() {
  dataBase.value = new Date(
    dataBase.value.getFullYear(),
    dataBase.value.getMonth() - 2
  )
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


/*evita erro de fuso horário */
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


function tipoDiaEvento(data: Date | null) {
  if (!data) return null

  for (const ev of eventos.value) {
    const inicio = criarDataLocal(ev.dataInicio)
    const fim = criarDataLocal(ev.dataFim)

    if (data.getTime() === inicio.getTime()) return 'inicio'
    if (data.getTime() === fim.getTime()) return 'fim'
    if (data > inicio && data < fim) return 'meio'
  }
  return null
}


function eventosDoMes(ano: number, mes: number) {
  return eventos.value.filter(ev => {
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
      dias: gerarDiasDoMes(m1.getFullYear(), m1.getMonth())
    },
    {
      ano: m2.getFullYear(),
      mes: m2.getMonth(),
      nome: m2.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      dias: gerarDiasDoMes(m2.getFullYear(), m2.getMonth())
    }
  ]
})


function formatarData(data: string) {
  const [y, m, d] = data.split('-')
  return `${d}/${m}/${y}`
}

function legendaEvento(ev: Evento) {
  return `${formatarData(ev.dataInicio)} até ${formatarData(ev.dataFim)} – ${ev.nome}`
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
        <span>D</span><span>S</span><span>T</span>
        <span>Q</span><span>Q</span><span>S</span><span>S</span>
      </div>

      <div class="dias">
        <span
          v-for="(dia, i) in mes.dias"
          :key="i"
          class="dia"
          :class="tipoDiaEvento(dia)"
        >
          {{ dia ? dia.getDate() : '' }}
        </span>
      </div>

        <div class="legenda">
          <p
            v-for="ev in eventosVisiveis(mes.ano, mes.mes)"
            :key="ev.id"
          >
            {{ legendaEvento(ev) }}
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
  gap: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 18px;
  max-width: 720px;
  margin: 24px auto;

  
  flex-wrap: nowrap;
  justify-content: space-between;
}


.mes {
  width: 50%;
  max-width: 340px;
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
  font-size: 15px;
  font-weight: 600;
}


button {
  background: #f1f3f4;
  border: none;
  font-size: 20px;
  cursor: pointer;
  border-radius: 50%;
  width: 32px;
  height: 32px;

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
  margin: 6px 0;
  font-size: 12px;
  color: #555;
}

.dias {
  gap: 6px;
}

.dia {
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: #eef6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
}


.dia.inicio {
  background: #2ecc71;
  color: #fff;
}

.dia.meio {
  background: #3498db;
  color: #fff;
}

.dia.fim {
  background: #9b59b6;
  color: #fff;
}

.legenda {
  margin-top: 6px;
  font-size: 10px;
  color: #007c91;
  line-height: 1.3;
}

.legenda p {
  margin-bottom: 4px;
}

.ver-mais {
  background: none;
  border: none;
  padding: 0;
  margin-top: 4px;
  font-size: 10px;
  color: #3498db;
  cursor: pointer;
  font-weight: 600;
}


@media (max-width: 480px) {
  .calendario {
    padding: 14px;
    gap: 12px;

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
    font-size: 11px;
  }

  .dias {
    gap: 4px;
  }

  .dia {
    font-size: 11px;
  }

  button {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }

 .legenda {
  font-size: 9px;
}

.ver-mais {
  font-size: 9px;
}

}


</style>
