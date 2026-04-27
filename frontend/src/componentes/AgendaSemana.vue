<script setup lang="ts">
import { computed, ref } from 'vue'

import type { EventRecord } from '@/types/event'
import { formatDate, formatHour } from '@/utils/date'

type ViewMode = 'semana' | 'lista'

const props = defineProps<{
  eventos: EventRecord[]
}>()

const emit = defineEmits<{
  select: [event: EventRecord]
}>()

const currentWeekStart = ref(getWeekStart(new Date()))
const selectedCategory = ref('Todas')
const viewMode = ref<ViewMode>('semana')

function getWeekStart(date: Date) {
  const base = new Date(date)
  const day = base.getDay()
  const diff = day === 0 ? -6 : 1 - day
  base.setDate(base.getDate() + diff)
  base.setHours(0, 0, 0, 0)
  return base
}

const weekDays = computed(() =>
  Array.from({ length: 7 }, (_, index) => {
    const day = new Date(currentWeekStart.value)
    day.setDate(currentWeekStart.value.getDate() + index)
    return day
  }),
)

const categories = computed(() => {
  const allCategories = props.eventos.flatMap((event) => event.categorias)
  return ['Todas', ...new Set(allCategories)]
})

const filteredEvents = computed(() =>
  props.eventos.filter((event) => {
    if (selectedCategory.value === 'Todas') return true
    return event.categorias.includes(selectedCategory.value)
  }),
)

function eventsForDay(day: Date) {
  return filteredEvents.value
    .filter((event) => {
      const start = new Date(event.dataEventoInicio)
      return start.toDateString() === day.toDateString()
    })
    .sort((a, b) => a.dataEventoInicio.localeCompare(b.dataEventoInicio))
}

function previousWeek() {
  const next = new Date(currentWeekStart.value)
  next.setDate(next.getDate() - 7)
  currentWeekStart.value = next
}

function nextWeek() {
  const next = new Date(currentWeekStart.value)
  next.setDate(next.getDate() + 7)
  currentWeekStart.value = next
}

const weekLabel = computed(() => {
  const start = weekDays.value[0]
  const end = weekDays.value[weekDays.value.length - 1]

  if (!start || !end) return 'Semana atual'

  return `${formatDate(start.toISOString())} até ${formatDate(end.toISOString())}`
})

// --- NOVO: Paleta de tons de verde e função para resgatar a cor ---
const greenGradients = [
  'linear-gradient(135deg, #0b513f, #0d6c53)', // Verde Padrão
  'linear-gradient(135deg, #086940, #0a8450)', // Verde Vibrante
  'linear-gradient(135deg, #145a32, #1d8348)', // Verde Floresta
  'linear-gradient(135deg, #0e6251, #117a65)', // Verde Esmeralda/Teal
  'linear-gradient(135deg, #1e8449, #27ae60)', // Verde Folha
]

function getCategoryStyle(category?: string) {
  if (!category) return { background: greenGradients[0] }

  // Pega o índice da categoria no array (ignora o "Todas" na posição 0)
  const index = categories.value.indexOf(category)

  // Calcula qual cor usar baseando-se no índice
  const colorIndex = index > 0 ? (index - 1) % greenGradients.length : 0

  return { background: greenGradients[colorIndex] }
}
</script>

<template>
  <section class="agenda">
    <header class="agenda-toolbar">
      <div class="toolbar-block">
        <button type="button" class="nav-button" @click="previousWeek">‹</button>
        <div>
          <span class="eyebrow">Programação</span>
          <h3>{{ weekLabel }}</h3>
        </div>
        <button type="button" class="nav-button" @click="nextWeek">›</button>
      </div>

      <div class="toolbar-actions">
        <select v-model="selectedCategory">
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <div class="segmented">
          <button
            type="button"
            :class="{ active: viewMode === 'semana' }"
            @click="viewMode = 'semana'"
          >
            Semana
          </button>
          <button
            type="button"
            :class="{ active: viewMode === 'lista' }"
            @click="viewMode = 'lista'"
          >
            Lista
          </button>
        </div>
      </div>
    </header>

    <div v-if="viewMode === 'semana'" class="week-grid">
      <article v-for="day in weekDays" :key="day.toISOString()" class="day-column">
        <header class="day-column__header">
          <strong>{{ day.getDate() }}</strong>
          <span>{{ day.toLocaleDateString('pt-BR', { weekday: 'short' }) }}</span>
        </header>

        <button
          v-for="event in eventsForDay(day)"
          :key="event.id"
          type="button"
          class="agenda-card"
          :style="getCategoryStyle(event.categorias[0])"
          @click="emit('select', event)"
        >
          <span class="agenda-card__tag">{{ event.categorias[0] || 'Evento' }}</span>
          <strong>{{ event.titulo }}</strong>
          <small>{{ event.local }}</small>
          <small
            >{{ formatHour(event.dataEventoInicio) }} às
            {{ formatHour(event.dataEventoFim) }}</small
          >
        </button>

        <p v-if="!eventsForDay(day).length" class="empty-state">Nenhum evento</p>
      </article>
    </div>

    <div v-else class="list-view">
      <button
        v-for="event in filteredEvents"
        :key="event.id"
        type="button"
        class="list-row"
        @click="emit('select', event)"
      >
        <div>
          <strong>{{ event.titulo }}</strong>
          <span>{{ event.local }}</span>
        </div>
        <small>{{ formatDate(event.dataEventoInicio) }}</small>
      </button>
    </div>
  </section>
</template>

<style scoped>
.agenda {
  background: #ffffff;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 18px 35px rgba(2, 64, 46, 0.08);
  display: grid;
  gap: 20px;
}

.agenda-toolbar,
.toolbar-block,
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.agenda-toolbar {
  justify-content: space-between;
  flex-wrap: wrap;
}

.eyebrow {
  color: #07753e;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
}

.agenda h3 {
  color: #0b513f;
  font-size: 1.4rem;
}

.nav-button,
.segmented button {
  border: none;
  background: rgba(11, 81, 63, 0.08);
  color: #0b513f;
  border-radius: 14px;
  min-width: 42px;
  min-height: 42px;
  padding: 0 14px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.segmented {
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  background: rgba(11, 81, 63, 0.08);
}

.segmented .active {
  background: #07753e;
  color: #ffffff;
}

.toolbar-actions select {
  min-height: 42px;
  border: 1px solid rgba(11, 81, 63, 0.12);
  border-radius: 14px;
  padding: 0 14px;
  font: inherit;
  color: #0b513f;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 14px;
}

.day-column {
  min-height: 220px;
  background: rgba(11, 81, 63, 0.03);
  border-radius: 20px;
  padding: 12px;
  display: grid;
  align-content: start;
  gap: 8px;
}

.day-column__header {
  display: grid;
  gap: 4px;
  color: #0b513f;
}

.agenda-card,
.list-row {
  border: none;
  text-align: left;
  border-radius: 16px;
  padding: 12px;
  display: grid;
  gap: 4px;
  cursor: pointer;
}

/* O background do agenda-card agora é gerenciado inline via :style, mantemos apenas a cor da fonte branca */
.agenda-card {
  color: #ffffff;
}

.agenda-card__tag {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.list-view {
  display: grid;
  gap: 12px;
}

.list-row {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  background: rgba(11, 81, 63, 0.06);
  color: #0b513f;
}

.list-row div {
  display: grid;
  gap: 6px;
}

.empty-state {
  color: rgba(10, 70, 53, 0.65);
  font-size: 0.92rem;
}

@media (max-width: 1100px) {
  .week-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .agenda {
    padding: 14px;
    gap: 14px;
    width: 100%;
  }

  .week-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .day-column {
    min-height: auto;
    border-radius: 16px;
    padding: 10px;
    gap: 6px;
  }

  .day-column__header strong {
    font-size: 1rem;
  }

  .day-column__header span {
    font-size: 0.75rem;
  }

  .agenda-card {
    border-radius: 14px;
    padding: 10px;
    gap: 3px;
  }

  .agenda-card strong {
    font-size: 0.84rem;
    line-height: 1.15;
  }

  .agenda-card small,
  .agenda-card__tag,
  .empty-state {
    font-size: 0.72rem;
    line-height: 1.2;
  }

  .list-row {
    grid-template-columns: 1fr;
    border-radius: 14px;
    padding: 12px;
  }

  .toolbar-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-block,
  .agenda-toolbar {
    align-items: stretch;
  }

  .agenda h3 {
    font-size: 1rem;
  }

  .toolbar-block {
    width: 100%;
    justify-content: space-between;
  }

  .day-column__header {
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 8px;
  }

  .nav-button,
  .segmented button,
  .toolbar-actions select {
    min-height: 38px;
  }
}
</style>
