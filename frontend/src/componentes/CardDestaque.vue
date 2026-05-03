<script setup lang="ts">
import type { EventRecord } from '@/types/event'
import { formatDate } from '@/utils/date'

const props = defineProps<{
  evento: EventRecord
}>()
</script>

<template>
  <article class="highlight-card">
    <div class="poster-layer" :class="{ 'default-bg': !props.evento.imagem }">
      <img
        v-if="props.evento.imagem"
        :src="props.evento.imagem"
        :alt="props.evento.titulo"
        class="highlight-card__image"
      />
    </div>

    <div class="highlight-card__content">
      <h3 class="title">{{ props.evento.titulo }}</h3>

      <div class="info-list">
        <div class="info-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{{ props.evento.local }}</span>
        </div>

        <div class="info-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{{ formatDate(props.evento.dataEventoInicio).slice(0, 5) }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.highlight-card {
  position: relative;
  aspect-ratio: 16 / 10;
  min-height: 280px;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  background-color: #1a1a1a;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transform: translateZ(0);
}

.poster-layer,
.highlight-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.highlight-card__image {
  object-fit: cover;
  object-position: center center;
  display: block;
  border: none;
  transform: scale(1.01);
}

.default-bg {
  background:
    linear-gradient(180deg, rgba(16, 42, 34, 0.12), rgba(16, 42, 34, 0.32)),
    url('@/assets/evento.jpg') center / cover no-repeat;
}

.highlight-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.2) 60%,
    transparent 100%
  );
  z-index: 1;
  pointer-events: none;
}

.highlight-card__content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #ffffff;
}

.poster-layer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.12) 38%,
    rgba(0, 0, 0, 0.5) 100%
  );
}

.title {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
}

.info-item svg {
  opacity: 0.8;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .highlight-card {
    aspect-ratio: 4 / 5;
    min-height: 380px;
    border-radius: 24px;
  }

  .highlight-card__content {
    padding: 24px;
    gap: 16px;
  }

  .title {
    font-size: 1.5rem;
    -webkit-line-clamp: 3;
  }

  .info-item {
    font-size: 1rem;
  }
}
</style>
