<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import EventForm from '@/componentes/EventForm.vue'
import Footer from '@/componentes/footer.vue'
import HeaderAdm from '@/componentes/headerAdm.vue'
import { deleteEvent, listCategories, listEvents, updateEvent } from '@/services/events'
import type { EventPayload, EventRecord } from '@/types/event'
import { formatDateRange } from '@/utils/date'

const events = ref<EventRecord[]>([])
const categorySuggestions = ref<string[]>([])
const loading = ref(true)
const saving = ref(false)
const selectedEvent = ref<EventRecord | null>(null)
const query = ref('')
const feedback = ref('')

const filteredEvents = computed(() =>
  events.value.filter((event) => {
    const search = query.value.trim().toLowerCase()
    if (!search) return true
    return (
      event.titulo.toLowerCase().includes(search) ||
      event.local.toLowerCase().includes(search) ||
      event.categorias.some((category) => category.toLowerCase().includes(search))
    )
  }),
)

async function loadPage() {
  loading.value = true

  try {
    const [eventData, categoryData] = await Promise.all([listEvents(), listCategories()])
    events.value = eventData
    categorySuggestions.value = categoryData.map((category) => category.nome)
  } catch {
    feedback.value = 'Não foi possível carregar a lista de eventos.'
  } finally {
    loading.value = false
  }
}

onMounted(loadPage)

async function handleSave(payload: EventPayload) {
  if (!selectedEvent.value) return

  saving.value = true
  feedback.value = ''

  try {
    const updated = await updateEvent(selectedEvent.value.id, payload)
    events.value = events.value.map((event) => (event.id === updated.id ? updated : event))
    selectedEvent.value = updated
    feedback.value = 'Evento atualizado com sucesso.'
  } catch {
    feedback.value = 'Não foi possível atualizar o evento.'
  } finally {
    saving.value = false
  }
}

async function handleDelete(eventId: string) {
  const confirmed = window.confirm('Deseja realmente excluir este evento?')
  if (!confirmed) return

  try {
    await deleteEvent(eventId)
    events.value = events.value.filter((event) => event.id !== eventId)
    if (selectedEvent.value?.id === eventId) selectedEvent.value = null
    feedback.value = 'Evento removido com sucesso.'
  } catch {
    feedback.value = 'Não foi possível excluir o evento.'
  }
}
</script>

<template>
  <div class="page">
    <HeaderAdm />

    <main class="manager-page">
      <section class="manager-hero">
        <div>
          <span class="eyebrow">Painel administrativo</span>
          <h1>Gerenciar eventos</h1>
          <p>Selecione um evento para editar seus dados com o mesmo formulário do cadastro.</p>
        </div>

        <input v-model="query" type="search" placeholder="Buscar por título, local ou categoria" />
      </section>

      <p v-if="feedback" class="feedback">{{ feedback }}</p>

      <div class="manager-layout">
        <section class="event-list">
          <div v-if="loading" class="list-card">Carregando eventos...</div>
          <article
            v-for="event in filteredEvents"
            :key="event.id"
            class="list-card"
            :class="{ active: selectedEvent?.id === event.id }"
            @click="selectedEvent = event"
          >
            <div class="list-card__top">
              <span>{{ event.categorias[0] || 'Evento' }}</span>
              <small>{{ formatDateRange(event.dataEventoInicio, event.dataEventoFim) }}</small>
            </div>
            <strong>{{ event.titulo }}</strong>
            <p>{{ event.local }}</p>
            <div class="list-card__actions">
              <span>Editar</span>
              <button type="button" class="delete-button" @click.stop="handleDelete(event.id)">
                Excluir
              </button>
            </div>
          </article>
        </section>

        <section class="editor-panel">
          <div v-if="selectedEvent" class="editor-panel__content">
            <div class="editor-panel__header">
              <div>
                <span class="eyebrow">Edição</span>
                <h2>{{ selectedEvent.titulo }}</h2>
              </div>
            </div>

            <EventForm
              :initial-value="selectedEvent"
              :busy="saving"
              :category-suggestions="categorySuggestions"
              submit-label="Salvar alterações"
              @submit="handleSave"
            />
          </div>
          <div v-else class="editor-empty">
            Selecione um evento da lista para editar seus dados.
          </div>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.manager-page {
  flex: 1;
  width: min(1440px, calc(100% - 48px));
  margin: 0 auto;
  padding: 36px 0 48px;
  display: grid;
  gap: 24px;
}

.manager-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: end;
}

.eyebrow {
  color: #07753e;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
}

.manager-hero h1,
.editor-panel__header h2 {
  color: #0b513f;
  font-size: clamp(2rem, 4vw, 3rem);
}

.manager-hero p,
.feedback {
  color: rgba(10, 70, 53, 0.78);
}

.manager-hero input {
  width: 100%;
  min-height: 54px;
  border: 1px solid rgba(11, 81, 63, 0.12);
  border-radius: 18px;
  padding: 0 18px;
  font: inherit;
}

.feedback {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 16px 18px;
  box-shadow: 0 18px 35px rgba(2, 64, 46, 0.08);
}

.manager-layout {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.event-list {
  display: grid;
  gap: 14px;
  max-height: 76vh;
  overflow: auto;
}

.list-card,
.editor-panel,
.editor-empty {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 18px 35px rgba(2, 64, 46, 0.08);
}

.list-card {
  border: 1px solid transparent;
  padding: 18px;
  text-align: left;
  display: grid;
  gap: 10px;
  cursor: pointer;
}

.list-card.active {
  border-color: rgba(7, 117, 62, 0.28);
}

.list-card__top,
.list-card__actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.list-card__top span {
  color: #07753e;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
}

.list-card strong,
.list-card p {
  color: #0b513f;
}

.list-card p {
  opacity: 0.76;
}

.delete-button {
  border: none;
  background: rgba(122, 43, 43, 0.1);
  color: #7a2b2b;
  border-radius: 999px;
  padding: 8px 12px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.editor-panel {
  padding: 24px;
}

.editor-empty {
  padding: 26px;
  color: rgba(10, 70, 53, 0.72);
}

.editor-panel__content {
  display: grid;
  gap: 20px;
}

@media (max-width: 1024px) {
  .manager-hero,
  .manager-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .manager-page {
    width: min(100%, calc(100% - 24px));
    padding-top: 20px;
  }

  .editor-panel {
    padding: 18px;
  }
}
</style>
