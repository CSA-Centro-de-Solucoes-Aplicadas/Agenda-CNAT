<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import CardDestaque from './CardDestaque.vue'
import CardInscricao from './CardInscricao.vue'
import ButtonSeta from './ButtonSeta.vue'

/* ---------- props ---------- */
const props = defineProps({
  itens: { type: Array, required: true },
  component: { type: Object, required: true },
})

/* ---------- device ---------- */
const device = ref('desktop')

function updateDevice() {
  const w = window.innerWidth
  if (w >= 1024) device.value = 'desktop'
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
const variant = computed(() =>
  props.component === CardDestaque ? 'destaque' : 'inscricao'
)

/* ---------- config central ---------- */
const DEVICE_CONFIG = {
  desktop: {
    destaque: { cardsPerPage: 4, maxWidth: '90vw' },
    inscricao: { cardsPerPage: 3, maxWidth: '70vw' },
  },
  tablet: {
    destaque: { cardsPerPage: 3, maxWidth: '95vw' },
    inscricao: { cardsPerPage: 2, maxWidth: '85vw' },
  },
  mobile: {
    destaque: { cardsPerPage: 1, maxWidth: '100vw' },
    inscricao: { cardsPerPage: 1, maxWidth: '100vw' },
  },
}

/* ---------- layout derivado ---------- */
const layoutConfig = computed(() =>
  DEVICE_CONFIG[device.value][variant.value]
)

const cardsPerPage = computed(() => layoutConfig.value.cardsPerPage)

/* ---------- navegação ---------- */
const currentIndex = ref(props.component === CardInscricao ? 1 : 0)
const viewport = ref(null)

// drag / swipe state
const isDragging = ref(false)
const startX = ref(0)
const dragOffset = ref(0) // in px, positive => dragged to right
const SWIPE_THRESHOLD_PCT = 0.15 // fraction of viewport width

const maxIndex = computed(() =>
  Math.max(0, props.itens.length - cardsPerPage.value)
)

const canPrev = computed(() => currentIndex.value > 0)
const canNext = computed(() => currentIndex.value < maxIndex.value)

function anterior() {
  if (canPrev.value) currentIndex.value--
}

function proximo() {
  if (canNext.value) currentIndex.value++
}

function moveToIndex(i) {
  currentIndex.value = i
}

/* ---------- translate ---------- */
const translateStyle = computed(() => {
  const basePercent = (100 / cardsPerPage.value) * currentIndex.value
  // use CSS calc to combine percent and pixel offset
  return {
    transform: `translateX(calc(-${basePercent}% + ${dragOffset.value}px))`,
    '--cards-per-page': cardsPerPage.value,
    maxWidth: layoutConfig.value.maxWidth,
  }
})

function clampIndex(i) {
  currentIndex.value = Math.max(0, Math.min(i, maxIndex.value))
}

function startDrag(clientX) {
  isDragging.value = true
  startX.value = clientX
  dragOffset.value = 0
}

function moveDrag(clientX) {
  if (!isDragging.value || !viewport.value) return
  dragOffset.value = clientX - startX.value
}

function endDrag() {
  if (!isDragging.value || !viewport.value) {
    dragOffset.value = 0
    isDragging.value = false
    return
  }
  const vw = viewport.value.clientWidth || window.innerWidth
  const threshold = vw * SWIPE_THRESHOLD_PCT
  if (dragOffset.value <= -threshold) {
    // swiped left -> next
    proximo()
  } else if (dragOffset.value >= threshold) {
    // swiped right -> prev
    anterior()
  }
  // reset drag
  dragOffset.value = 0
  isDragging.value = false
}

// Pointer/mouse handlers (desktop)
function onMouseDown(e) {
  e.preventDefault()
  startDrag(e.clientX)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}
function onMouseMove(e) {
  moveDrag(e.clientX)
}
function onMouseUp() {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  endDrag()
}

// Touch handlers (mobile/tablet)
function onTouchStart(e) {
  if (!e.touches || e.touches.length === 0) return
  startDrag(e.touches[0].clientX)
}
function onTouchMove(e) {
  if (!e.touches || e.touches.length === 0) return
  // prevent vertical scroll when horizontal gesture is detected
  const touch = e.touches[0]
  moveDrag(touch.clientX)
}
function onTouchEnd() {
  endDrag()
}

/* ---------- dots ---------- */
const totalPages = computed(() => maxIndex.value + 1)
</script>

<template>
  <div class="carrossel-wrapper">
    <div class="carrossel" :style="{ maxWidth: `min(1318px, ${layoutConfig.maxWidth})` }">
      <ButtonSeta class="seta esquerda" @click="anterior" :disabled="!canPrev" />

      <div class="viewport" ref="viewport"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown.prevent="onMouseDown"
      >
        <div
          class="Itens"
          :class="{
            ItensInscricao: variant === 'inscricao',
            ItensDestaque: variant === 'destaque',
          }"
          :style="translateStyle"
        >
          <component
            v-for="(item, i) in itens"
            :key="i"
            :is="component"
            :item="item"
            :class="{ emphasis: i === currentIndex && variant === 'inscricao' }"
          />
        </div>
      </div>

      <ButtonSeta
        class="seta direita"
        @click="proximo"
        :disabled="!canNext"
        style="transform: scaleX(-1)"
      />
    </div>

    <div class="pagination-dots">
      <button
        v-for="i in totalPages"
        :key="i"
        class="dot"
        :class="{ active: currentIndex === i - 1 }"
        @click="moveToIndex(i - 1)"
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
}

.carrossel {
  display: flex;
  align-items: center;
  position: relative;
  gap: 0.875rem;
  max-width: 1318px;
  overflow: hidden;
  margin: auto;
}

.CarrosselInscricao {
  max-width: 70vw;
}

.viewport {
  overflow: hidden;
  width: 100%;
  will-change: transform;
}

.Itens {
  display: flex;
  transition: transform 0.6s ease;
  /* suaviza a passagem */
  gap: 2rem;
  padding: 2rem 0rem;
}

.ItensInscricao {
  padding: 2rem 0rem 2rem 0rem;
  gap: 4rem;
}

.Itens::-webkit-scrollbar {
  display: none;
}

.Itens > * {
  scroll-snap-align: start;
  flex: 0 0 auto;
  cursor: pointer;
  /* ocupa 100% da largura da viewport */
}

.ItensDestaque > *:hover {
  transform: scale(1.05);
  transition: transform 0.4s ease;
}

/* Indicador de páginas em formato de círculos */
.pagination-dots {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dot:hover {
  border-color: #999;
  transform: scale(1.2);
}

.dot.active {
  background-color: #333;
  border-color: #333;
}

.emphasis {
  transform: scale(1.2);
  transition: transform 0.6s ease;
}
</style>
