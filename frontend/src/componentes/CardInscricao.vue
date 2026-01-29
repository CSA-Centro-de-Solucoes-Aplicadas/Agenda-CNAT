<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  evento: Evento,
}>()
interface Evento {
  titulo: string
  descricao?: string
  dataInscricaoInicio: string
  dataInscricaoFim: string
  dataEventoInicio: string
  dataEventoFim: string
  categorias: string[]
  local: string
  linkInscricao?: string
  colaboradores?: string[]
  }

// Mapear categorias para nomes de arquivos de ícones
const getPrimeiraCategoria = (categorias: string[]) => {
  return categorias?.[0] ?? 'Geral'
}

// Definir o ícone
const getIconPath = (categoria: string) => {
  const categoryMap: Record<string, string> = {
    'Palestras': 'palestras.svg',
    'Cultura': 'cultura.svg',
    'Esporte': 'esporte.svg',
    'Tecnologia': 'tecnologia.svg',
    'Saúde': 'saude.svg',
  }

  const fileName = categoryMap[categoria] || 'default.svg'
  return `/src/assets/images/icons/${fileName}`
}

// dataISO é uma string no formato ISO 8601
const separarDataHora = (dataISO?: string) => {
  if (!dataISO) return { data: '--/--/--', hora: '--:--' }

  const dataObj = new Date(dataISO);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR');
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return { data: dataFormatada, hora: horaFormatada };
}

</script>
<template>
  <div class="cardevento">
    <div class="cardheader">
      <h3>
        {{ props.evento?.titulo }}
      </h3>
      <p class="local">{{ props.evento?.local }}</p>
    </div>
    <div class="cardbody">
      <ul class="timeline">
        <li>
          <p class="data">
            {{ separarDataHora(props.evento.dataInscricaoInicio).data }} <br />
            {{ separarDataHora(props.evento.dataInscricaoInicio).hora }}
          </p>
          <p class="descricao">Início das inscrições</p>
        </li>
        <li>
          <p class="data">
            {{ separarDataHora(props.evento.dataInscricaoFim).data }} <br />
            {{ separarDataHora(props.evento.dataInscricaoFim).hora }}
          </p>
          <p class="descricao">Fim das inscrições</p>
        </li>
      </ul>
    </div>
    <div class="cardfooter">
      <p>{{ getPrimeiraCategoria(props.evento.categorias) }}</p>
      <img :src="getIconPath(getPrimeiraCategoria(props.evento.categorias))" alt="Ícone da categoria" width="20px"></img>
    </div>
  </div>
</template>
<style scoped>
* {
  margin: 0;
}
li {
  padding: 0.5rem 0;
  position: relative;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.local {
  font-size: 0.85rem;
  color: #575757;
}
.descricao {
  font-size: 0.75rem;
}
.data {
  font-size: 0.68rem;
  font-weight: normal;
}
.cardfooter {
  justify-content: right;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: flex-end;
  width: 100%;
}
/* Melhor responsividade e legibilidade */
.cardevento {
  background-image: url('@/assets/images/illustrations/CardInscricoes_background.png');
  background-size: cover;
  background-position: center;
  max-width: 420px;
  width: 100%;
  border-radius: 16px;
  padding: 18px 28px 10px 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0.5rem auto;
  box-sizing: border-box;
  transition: box-shadow 0.3s, transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: grab;
  font-family: 'Lato', Arial, sans-serif;
}

.cardevento:active {
  cursor: grabbing;
}

.cardheader {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.cardheader h3 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0b513f;
  margin-bottom: 0.25em;
  line-height: 1.3;
  word-break: break-word;
  letter-spacing: -0.3px;
}

.local {
  font-size: 1.05rem;
  color: #666;
  margin-bottom: 0.3em;
  font-weight: 500;
}

.timeline {
  border-left: 2px solid #000000;
  margin-left: 8px;
  padding-left: 16px;
  list-style-type: none;
  margin-bottom: 0.8em;
}

li {
  padding: 0.6rem 0;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.05);
  padding-left: 8px;
  border-radius: 4px;
}

li:first-child::before {
  content: '•';
  font-size: 2rem;
  position: absolute;
  left: -23px;
  top: 6px;
  color: #009218;
}

li:last-child::before {
  content: '•';
  font-size: 2rem;
  position: absolute;
  left: -23px;
  top: 6px;
  color: #c62828;
}

.data {
  font-size: 1.02rem;
  font-weight: 700;
  color: #0b513f;
  margin-bottom: 0.15em;
  letter-spacing: 0.3px;
}

.descricao {
  font-size: 0.95rem;
  color: #222;
  line-height: 1.5;
  font-weight: 500;
}

.cardfooter {
  justify-content: right;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: end;
  width: 100%;
  font-size: 1.02rem;
  margin-top: auto;
  padding-top: 0.8em;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  gap: 0.8em;
}

.categoria-info {
  display: flex;
}

.categoria-texto {
  margin: 0;
  color: #fff;
  font-size: 1.02rem;
  font-weight: 600;
}

.categoria-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

@media (max-width: 750px) {
  .cardevento {
    background-position: 70% 30%;
    max-width: 98vw;
    padding: 16px 6vw 12px 6vw;
    border-radius: 10px;
    gap: 0.6rem;
  }
  .cardheader h3 {
    font-size: 1.15rem;
  }
  .local {
    font-size: 0.95rem;
  }
  .data {
    font-size: 0.95rem;
  }
  .descricao {
    font-size: 0.88rem;
  }
  .cardfooter {
    font-size: 0.95rem;
    gap: 0.8em;
  }
  .categoria-icon {
    width: 32px;
    height: 32px;
  }
}
@media (max-width: 480px) {
  .cardevento {
    max-width: 100%;
    padding: 14px 5vw 12px 5vw;
    border-radius: 12px;
    gap: 0.5rem;
  }

  .cardheader h3 {
    font-size: 1.05rem;
    line-height: 1.25;
  }

  .local {
    font-size: 0.85rem;
  }

  .timeline {
    margin-left: 6px;
    padding-left: 12px;
  }

  li {
    padding: 0.45rem 0.10rem;
    gap: 0.25rem;
  }

  .data {
    font-size: 0.85rem;
  }

  .descricao {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .cardfooter {
    font-size: 0.85rem;
    gap: 0.6rem;
    padding-top: 0.6em;
  }

  .cardfooter img {
    width: 18px;
  }
}
@media (max-width: 360px) {
  .cardheader h3 {
    font-size: 0.95rem;
  }

  .descricao {
    font-size: 0.75rem;
  }

  .data {
    font-size: 0.78rem;
  }

  .cardfooter {
    flex-direction: row;
    justify-content: flex-end;
    font-size: 0.8rem;
  }
}

</style>