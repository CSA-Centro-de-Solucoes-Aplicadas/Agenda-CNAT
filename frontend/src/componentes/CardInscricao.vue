<script setup lang="ts">
import type { EventRecord } from '@/types/event'
import { formatDate, formatHour } from '@/utils/date'

const props = defineProps<{
  evento: EventRecord
}>()
</script>

<template>
  <article class="registration-card">
    <header class="registration-card__header">
      <div>
        <span>{{ props.evento.categorias[0] || 'Evento' }}</span>
        <h3>{{ props.evento.titulo }}</h3>
      </div>
      <strong class="status-chip">Inscrições abertas</strong>
    </header>

    <p class="registration-card__location">{{ props.evento.local }}</p>

    <div class="registration-card__timeline">
      <article>
        <small>Abertura</small>
        <strong>{{ formatDate(props.evento.dataInscricaoInicio) }}</strong>
        <span>{{ formatHour(props.evento.dataInscricaoInicio) }}</span>
      </article>
      <article>
        <small>Encerramento</small>
        <strong>{{ formatDate(props.evento.dataInscricaoFim) }}</strong>
        <span>{{ formatHour(props.evento.dataInscricaoFim) }}</span>
      </article>
    </div>

    <footer class="registration-card__footer">
      <span>{{ formatDate(props.evento.dataEventoInicio) }}</span>
      <small>Ver evento completo</small>
    </footer>
  </article>
</template>

<style scoped>
.registration-card {
  min-height: 280px;
  border-radius: 24px;
  padding: 22px;
  display: grid;
  gap: 18px;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  box-shadow: 0 20px 36px rgba(0, 0, 0, 0.12);
}

.registration-card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.registration-card__header span {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.registration-card__header h3 {
  font-size: 1.35rem;
  line-height: 1.12;
}

.status-chip {
  white-space: nowrap;
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 0.78rem;
}

.registration-card__location {
  color: rgba(255, 255, 255, 0.9);
}

.registration-card__timeline {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.registration-card__timeline article {
  display: grid;
  gap: 4px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(8, 63, 46, 0.28);
}

.registration-card__timeline small,
.registration-card__timeline span {
  color: rgba(255, 255, 255, 0.82);
}

.registration-card__footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
}

@media (max-width: 640px) {
  .registration-card {
    min-height: 244px;
    padding: 18px;
    border-radius: 18px;
  }

  .registration-card__header,
  .registration-card__footer,
  .registration-card__timeline {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }

  .registration-card__header h3 {
    font-size: 1.12rem;
  }
}
</style>
