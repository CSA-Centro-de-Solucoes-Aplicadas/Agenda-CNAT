<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import CardDestaque from './CardDestaque.vue'
import CardInscricao from './CardInscricao.vue'

/* ---------- props ---------- */
const props = defineProps({
  itens: { type: Array, required: true },
  component: { type: Object, required: true },
})

/* ---------- device ---------- */
const device = ref('desktop')

function updateDevice() {
  const w = window.innerWidth
  if (w >= 1440) device.value = 'desktop'
  else if (w >= 768) device.value = 'tablet'
  else device.value = 'mobile'
}

onMounted(() => {
  updateDevice()
  window.addEventListener('resize', updateDevice)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDevice)
})

/* ---------- variant ---------- */
const variant = computed(() => (props.component === CardDestaque ? 'destaque' : 'inscricao'))

/* ---------- config central ---------- */
const DEVICE_CONFIG = {
  desktop: {
    destaque: { cardsPerPage: 4 },
    inscricao: { cardsPerPage: 3 },
  },
  tablet: {
    destaque: { cardsPerPage: 3 },
    inscricao: { cardsPerPage: 3 },
  },
  mobile: {
    destaque: { cardsPerPage: 2 },
    inscricao: { cardsPerPage: 3 },
  },
}

/* ---------- layout derivado ---------- */
const layoutConfig = computed(() => DEVICE_CONFIG[device.value][variant.value])
const cardsPerPage = computed(() => layoutConfig.value.cardsPerPage)

/* ---------- viewport e scroll ---------- */
const viewport = ref(null)
const currentIndex = ref(0)
const isDragging = ref(false)
const startX = ref(0)

/* ---------- navegação calculada ---------- */
const maxIndex = computed(() => Math.max(0, props.itens.length - cardsPerPage.value))
const totalPages = computed(() => maxIndex.value + 1)

/* ---------- scroll para índice ---------- */
function scrollToIndex(index) {
  if (!viewport.value) return
  
  currentIndex.value = Math.max(0, Math.min(index, maxIndex.value))
  
  // Calcula a posição de scroll baseado no índice
  const element = viewport.value.querySelector('.Itens > *')
  if (!element) return
  
  const cardWidth = element.offsetWidth
  const gap = parseFloat(getComputedStyle(viewport.value.querySelector('.Itens')).gap || 0)
  const scrollPosition = (cardWidth + gap) * currentIndex.value
  
  viewport.value.scrollTo({
    left: scrollPosition,
    behavior: 'smooth',
  })
}

/* ---------- scroll snap manual ---------- */
function snapToNearestCard() {
  if (!viewport.value) return
  
  const element = viewport.value.querySelector('.Itens > *')
  if (!element) return
  
  const cardWidth = element.offsetWidth
  const gap = parseFloat(getComputedStyle(viewport.value.querySelector('.Itens')).gap || 0)
  const step = cardWidth + gap
  
  const scrollPos = viewport.value.scrollLeft
  const nearestIndex = Math.round(scrollPos / step)
  
  // Restaura scroll-behavior smooth para snap suave
  if (viewport.value.classList.contains('is-dragging')) {
    viewport.value.classList.remove('is-dragging')
  }
  
  scrollToIndex(nearestIndex)
}

/* ---------- drag handlers ---------- */
function onMouseDown(e) {
  isDragging.value = true
  startX.value = e.clientX
  e.preventDefault()
  
  // Listeners locais no viewport
  viewport.value?.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e) {
  if (!isDragging.value || !viewport.value) return
  
  e.preventDefault()
  const diff = startX.value - e.clientX
  viewport.value.scrollLeft += diff
  startX.value = e.clientX
}

function onMouseUp() {
  isDragging.value = false
  
  if (viewport.value) {
    viewport.value.removeEventListener('mousemove', onMouseMove)
  }
  window.removeEventListener('mouseup', onMouseUp)
  
  // Snap suave após soltar
  setTimeout(() => snapToNearestCard(), 50)
}

/* ---------- touch handlers ---------- */
function onTouchStart(e) {
  if (!e.touches || e.touches.length === 0) return
  isDragging.value = true
  startX.value = e.touches[0].clientX
}

function onTouchMove(e) {
  if (!isDragging.value || !e.touches || e.touches.length === 0) return
  
  const diff = startX.value - e.touches[0].clientX
  if (viewport.value) {
    viewport.value.scrollLeft += diff
  }
  startX.value = e.touches[0].clientX
}

function onTouchEnd() {
  isDragging.value = false
  snapToNearestCard()
}

/* ---------- scroll listener para sincronizar index ---------- */
function onScroll() {
  if (!viewport.value) return
  
  const element = viewport.value.querySelector('.Itens > *')
  if (!element) return
  
  const cardWidth = element.offsetWidth
  const gap = parseFloat(getComputedStyle(viewport.value.querySelector('.Itens')).gap || 0)
  const step = cardWidth + gap
  
  // Apenas sincroniza index quando não está arrastando
  if (!isDragging.value) {
    currentIndex.value = Math.round(viewport.value.scrollLeft / step)
  }
}
</script>

<template>
  <div class="carrossel-wrapper">
    <div 
      class="viewport"
      ref="viewport"
      :class="{
        'viewport-destaque': variant === 'destaque',
        'viewport-inscricao': variant === 'inscricao',
        'is-dragging': isDragging,
      }"
      @mousedown="onMouseDown"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
      @scroll="onScroll"
    >
      <div
        class="Itens"
        :class="{
          ItensInscricao: variant === 'inscricao',
          ItensDestaque: variant === 'destaque',
        }"
      >
        <component
          v-for="(item, i) in itens"
          :key="i"
          :is="component"
          :item="item"
          :class="{ emphasis: variant === 'inscricao' }"
        />
      </div>
    </div>
    
    <!-- Barra de índice -->
    <div class="scroll-index">
      <button
        v-for="i in totalPages"
        :key="i"
        class="index-dot"
        :class="{ active: currentIndex === i - 1 }"
        @click="scrollToIndex(i - 1)"
        :aria-label="`Ir para card ${i}`"
      />
    </div>
  </div>
</template>

<style scoped>
.carrossel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.viewport {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  cursor: grab;
  scroll-behavior: smooth;
  transition: scroll-behavior 0.2s ease;
}

.viewport.is-dragging {
  cursor: grabbing;
  scroll-behavior: auto;
  scroll-snap-type: none;
}

/* Remove scrollbar visível */
.viewport::-webkit-scrollbar {
  height: 0;
}

.viewport-destaque {
  max-width: 100%;
}

.viewport-inscricao {
  max-width: 100%;
}

.Itens {
  display: flex;
  gap: clamp(1rem, 3vw, 2rem);
  padding: 2rem clamp(0.5rem, 2vw, 2rem);
  scroll-snap-type: x mandatory;
}

.ItensInscricao {
  gap: 4rem;
  padding: 2rem clamp(1rem, 5vw, 3rem);
  /* Centraliza com overflow nas laterais */
  width: fit-content;
  margin: 0 auto;
}

.ItensDestaque {
  gap: clamp(1rem, 3vw, 2rem);
  padding: 2rem clamp(1rem, 2vw, 2rem);
}

.Itens > * {
  scroll-snap-align: start;
  flex: 0 0 auto;
  scroll-snap-stop: always;
  user-select: none;
}

/* Destaque: responsivo com flex */
.ItensDestaque > * {
  width: calc((100% / 4) - (3 * clamp(1rem, 3vw, 2rem) / 4));
  max-width: 260px;
}

/* Inscrição: 3 cards com ênfase central */
.ItensInscricao > * {
  width: calc((100% / 3) - (2 * 4rem / 3));
  max-width: 300px;
}

.ItensDestaque > *:hover {
  transform: scale(1.05);
  transition: transform 0.4s ease;
}

/* Ênfase no card central para inscrições */
.ItensInscricao > .emphasis {
  transform: scale(1.15);
  z-index: 10;
  transition: transform 0.4s ease;
}

/* Barra de índice em formato de dots */
.scroll-index {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.index-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #ddd;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  margin: 0;
}

.index-dot:hover {
  border-color: #999;
  transform: scale(1.2);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.index-dot.active {
  background-color: #0b513f;
  border-color: #0b513f;
  box-shadow: 0 0 12px rgba(11, 81, 63, 0.4);
}

/* Mobile: 2 cards para destaque */
@media (max-width: 1439px) and (min-width: 768px) {
  .ItensDestaque > * {
    width: calc((100% / 3) - (2 * clamp(1rem, 3vw, 2rem) / 3));
  }
}

@media (max-width: 767px) {
  .ItensDestaque > * {
    width: calc((100% / 2) - (1 * clamp(1rem, 3vw, 2rem) / 2));
    max-width: 100%;
  }

  .ItensInscricao > * {
    width: calc((100% / 3) - (2 * 4rem / 3));
    max-width: 100%;
  }
  
  .index-dot {
    width: 8px;
    height: 8px;
  }
}
</style>
