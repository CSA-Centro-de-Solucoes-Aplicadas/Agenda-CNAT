<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import CardDestaque from '@/componentes/CardDestaque.vue'
import type { EventRecord } from '@/types/event'

const props = defineProps<{
  eventos: EventRecord[]
  component: object
}>()

const emit = defineEmits<{
  select: [event: EventRecord]
}>()

const currentPage = ref(0)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)

const isHighlight = computed(() => props.component === CardDestaque)

function updateWindowWidth() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

const slidesPerView = computed(() => {
  if (windowWidth.value <= 640) return 1
  if (windowWidth.value <= 1024) return isHighlight.value ? 2 : 1 
  return isHighlight.value ? 3 : 3 
})

const totalPages = computed(() => {
  if (props.eventos.length === 0) return 1
  if (isHighlight.value) return props.eventos.length
  return Math.max(1, props.eventos.length - slidesPerView.value + 1)
})

const trackStyle = computed(() => {
  if (isHighlight.value) return {}
  return {
    transform: `translateX(-${currentPage.value * (100 / slidesPerView.value)}%)`,
  }
})

function getSlideState(index: number) {
  if (!isHighlight.value) return '' 
  
  const total = props.eventos.length
  if (total === 0) return ''

  let diff = index - currentPage.value

  if (diff > Math.floor(total / 2)) diff -= total
  if (diff < -Math.floor(total / 2)) diff += total

  if (diff === 0) return 'center'
  if (diff === -1) return 'left'
  if (diff === 1) return 'right'
  return 'hidden'
}

function handleSlideClick(index: number, event: EventRecord) {
  if (!isHighlight.value) {
    emit('select', event)
    return
  }

  const state = getSlideState(index)
  if (state === 'center') {
    emit('select', event)
  } else if (state === 'left') {
    previous()
  } else if (state === 'right') {
    next()
  }
}

function next() {
  if (isHighlight.value) {
    currentPage.value = (currentPage.value + 1) % totalPages.value
  } else {
    currentPage.value = Math.min(currentPage.value + 1, totalPages.value - 1)
  }
}

function previous() {
  if (isHighlight.value) {
    currentPage.value = (currentPage.value - 1 + totalPages.value) % totalPages.value
  } else {
    currentPage.value = Math.max(currentPage.value - 1, 0)
  }
}

function goTo(index: number) {
  currentPage.value = index
}
</script>

<template>
  <div class="carousel-shell" :class="{ 'is-coverflow': isHighlight }">
    <div v-if="!props.eventos.length" class="carousel-empty">
      <strong>não há eventos cadastrados</strong>
    </div>

    <div v-else class="carousel-stage">
      <button
        v-if="totalPages > 1"
        type="button"
        class="nav-button nav-button--prev"
        @click="previous"
        :disabled="!isHighlight && currentPage === 0"
      >
        ‹
      </button>

      <div class="viewport">
        <div class="track" :style="trackStyle">
          <div
            v-for="(event, index) in props.eventos"
            :key="event.id"
            class="slide"
            :class="getSlideState(index)"
            :style="{ width: isHighlight ? '' : `${100 / slidesPerView}%` }"
          >
            <div v-if="isHighlight && getSlideState(index) !== 'center'" class="cover-overlay"></div>
            
            <button type="button" class="slide-button" @click="handleSlideClick(index, event)">
              <component :is="props.component" :evento="event" />
            </button>
          </div>
        </div>
      </div>

      <button
        v-if="totalPages > 1"
        type="button"
        class="nav-button nav-button--next"
        @click="next"
        :disabled="!isHighlight && currentPage >= totalPages - 1"
      >
        ›
      </button>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
        v-for="index in totalPages"
        :key="index"
        type="button"
        class="pagination-dot"
        :class="{ active: currentPage === index - 1 }"
        @click="goTo(index - 1)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.carousel-shell {
  display: grid;
  gap: 16px;
  margin-top: 100px;
}

.carousel-empty {
  min-height: 220px;
  display: grid;
  place-items: center;
  border: 1px dashed rgba(7, 117, 62, 0.28);
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(138, 238, 195, 0.24), rgba(255, 255, 255, 0.95)),
    #ffffff;
  color: #0b513f;
  text-align: center;
  box-shadow: 0 18px 35px rgba(2, 64, 46, 0.08);
}

.carousel-empty strong {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  text-transform: lowercase;
}

.carousel-stage {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
}

.viewport {
  overflow: hidden;
  width: 100%;
  padding: 20px 0;
  position: relative;
}

.track {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
  align-items: center;
}

.slide {
  flex: 0 0 auto;
  padding: 0 8px;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
}

/* ========================================================
   ESTILOS DESKTOP/TABLET (Coverflow)
   ======================================================== */
.is-coverflow .viewport {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.is-coverflow .track {
  width: 100%;
  height: 100%;
  position: relative;
  justify-content: center;
}

.is-coverflow .slide {
  position: absolute;
  width: 50% !important;
  max-width: 550px;
  padding: 0;
  left: 50%;
  top: 50%;
  border-radius: 24px; /* <--- AQUI: Isso garante que a sombra faça a curva! */
}

.is-coverflow .slide.hidden {
  transform: translate(-50%, -50%) scale(0.4);
  opacity: 0;
  z-index: 0;
  pointer-events: none;
}

.is-coverflow .slide.center {
  transform: translate(-50%, -50%) scale(1.15);
  z-index: 10;
  opacity: 1;
  pointer-events: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); /* Agora essa sombra ficará arredondada */
  border-radius: 24px;
}

.is-coverflow .slide.left {
  transform: translate(-105%, -50%) scale(0.85);
  z-index: 5;
  opacity: 0.8;
  pointer-events: auto;
  cursor: pointer;
  border-radius: 24px;
}

.is-coverflow .slide.right {
  transform: translate(5%, -50%) scale(0.85);
  z-index: 5;
  opacity: 0.8;
  pointer-events: auto;
  cursor: pointer;
  border-radius: 24px;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 24px;
  z-index: 5;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.is-coverflow .slide.center .cover-overlay {
  opacity: 0;
}

.slide-button {
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  border-radius: 24px;
}

.slide-button :deep(article) {
  width: 100%;
  max-width: none;
}

  
.nav-button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #0b513f;
  font-size: 2rem;
  box-shadow: 0 12px 24px rgba(2, 64, 46, 0.12);
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  padding-bottom: 3px;
}

.nav-button:disabled {
  opacity: 0.45;
  cursor: default;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pagination-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(11, 81, 63, 0.2);
  cursor: pointer;
  transition: background 0.3s ease;
}

.pagination-dot.active {
  background: #0b513f;
  transform: scale(1.2);
}

@media (max-width: 800px) {
  .is-coverflow .slide {
    width: 65% !important;
  }
}


@media (max-width: 640px) {
  .carousel-stage {
    grid-template-columns: 1fr;
  }

  .nav-button {
    display: none;
  }

  .is-coverflow .viewport {
    height: 400px;
  }

  .is-coverflow .slide {
    width: 90% !important;
  }

  .is-coverflow .slide.center {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); /* Sombra suave arredondada no mobile */
  }

  .is-coverflow .slide.left,
  .is-coverflow .slide.right {
    opacity: 0;
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}
</style>
