<script setup lang="ts">
import { computed } from 'vue'

import type { EventRecord } from '@/types/event'
import { formatDateRange, isRegistrationOpen } from '@/utils/date'

const props = defineProps<{
  eventoSelecionado: EventRecord
}>()

const emit = defineEmits<{
  close: []
}>()

const registrationStatus = computed(() =>
  isRegistrationOpen(
    props.eventoSelecionado.dataInscricaoInicio,
    props.eventoSelecionado.dataInscricaoFim,
  )
    ? 'Inscrições abertas'
    : 'Programação do evento',
)
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card">
      <button type="button" class="close-button" @click="emit('close')">×</button>

      <div class="modal-media">
        <img
          v-if="props.eventoSelecionado.imagem"
          :src="props.eventoSelecionado.imagem"
          :alt="props.eventoSelecionado.titulo"
        />
        <div v-else class="media-placeholder">
          <span>{{ props.eventoSelecionado.categorias[0] || 'Evento' }}</span>
          <strong>{{ props.eventoSelecionado.titulo }}</strong>
        </div>
      </div>

      <div class="modal-content">
        <span class="status-pill">{{ registrationStatus }}</span>
        <h2>{{ props.eventoSelecionado.titulo }}</h2>
        <p class="modal-location">{{ props.eventoSelecionado.local }}</p>

        <div class="info-grid">
          <article class="info-card">
            <strong>Evento</strong>
            <span>{{
              formatDateRange(props.eventoSelecionado.dataEventoInicio, props.eventoSelecionado.dataEventoFim)
            }}</span>
          </article>

          <article class="info-card" v-if="props.eventoSelecionado.dataInscricaoInicio || props.eventoSelecionado.dataInscricaoFim">
            <strong>Inscrições</strong>
            <span>{{
              formatDateRange(
                props.eventoSelecionado.dataInscricaoInicio,
                props.eventoSelecionado.dataInscricaoFim,
              )
            }}</span>
          </article>
        </div>

        <p class="modal-description">{{ props.eventoSelecionado.descricao }}</p>

        <div class="meta-row">
          <div class="meta-block">
            <strong>Categorias</strong>
            <div class="chip-list">
              <span v-for="category in props.eventoSelecionado.categorias" :key="category" class="chip">
                {{ category }}
              </span>
            </div>
          </div>

          <div class="meta-block">
            <strong>Organizadores</strong>
            <div class="chip-list">
              <span
                v-for="organizer in props.eventoSelecionado.organizadores"
                :key="organizer"
                class="chip chip--soft"
              >
                {{ organizer }}
              </span>
              <span v-if="!props.eventoSelecionado.organizadores.length" class="chip chip--soft">
                Não informado
              </span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <a
            v-if="props.eventoSelecionado.linkInformacao"
            :href="props.eventoSelecionado.linkInformacao"
            target="_blank"
            rel="noreferrer"
            class="secondary-link"
          >
            Mais informações
          </a>

          <a
            v-if="props.eventoSelecionado.linkInscricao"
            :href="props.eventoSelecionado.linkInscricao"
            target="_blank"
            rel="noreferrer"
            class="primary-link"
          >
            Ir para inscrição
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 34, 24, 0.62);
  padding: 32px;
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal-card {
  position: relative;
  width: min(1080px, 100%);
  max-height: min(88vh, 920px);
  overflow: hidden auto;
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr);
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 32px 60px rgba(0, 0, 0, 0.24);
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #0b513f;
  font-size: 1.8rem;
  cursor: pointer;
  z-index: 2;
}

.modal-media {
  min-height: 100%;
  background: linear-gradient(135deg, rgba(7, 117, 62, 0.9), rgba(138, 238, 195, 0.7));
}

.modal-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-placeholder {
  height: 100%;
  display: grid;
  align-content: end;
  gap: 12px;
  padding: 28px;
  color: #ffffff;
}

.media-placeholder span {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
}

.media-placeholder strong {
  font-size: 2rem;
  line-height: 1.1;
}

.modal-content {
  display: grid;
  gap: 22px;
  padding: 40px;
}

.status-pill {
  justify-self: start;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(138, 238, 195, 0.28);
  color: #07753e;
  font-weight: 700;
}

.modal-content h2 {
  color: #0b513f;
  font-size: 2rem;
  line-height: 1.05;
}

.modal-location,
.modal-description {
  color: rgba(10, 70, 53, 0.82);
}

.info-grid,
.meta-row {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.info-card,
.meta-block {
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(11, 81, 63, 0.05);
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(138, 238, 195, 0.32);
  color: #0b513f;
}

.chip--soft {
  background: rgba(11, 81, 63, 0.08);
}

.modal-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: auto;
}

.primary-link,
.secondary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
}

.primary-link {
  background: #07753e;
  color: #ffffff;
}

.secondary-link {
  background: rgba(11, 81, 63, 0.08);
  color: #0b513f;
}

@media (max-width: 900px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-card {
    grid-template-columns: 1fr;
  }

  .modal-media {
    min-height: 280px;
  }

  .modal-content,
  .info-grid,
  .meta-row {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 24px;
  }
}
</style>
