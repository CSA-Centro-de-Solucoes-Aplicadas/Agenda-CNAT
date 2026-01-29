<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Scrollbar, Mousewheel, FreeMode, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/scrollbar'
import CardDestaque from './CardDestaque.vue'
import CardInscricao from './CardInscricao.vue'

/*---------- emits ---------- */
const emit = defineEmits(['select'])

/* ---------- modules Swiper ---------- */
const modules = [Scrollbar, Mousewheel, FreeMode, Navigation]

/* ---------- props ---------- */
const props = defineProps({
  eventos: { type: Array, required: true },
  component: { type: Object, required: true },
})
/* ---------- device ---------- */
const device = ref('desktop')

function updateDevice() {
  const w = window.innerWidth
  if (w >= 1200) device.value = 'desktop'
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
    destaque: { slidesPerView: 4 },
    inscricao: { slidesPerView: 3 },
  },
  tablet: {
    destaque: { slidesPerView: 3 },
    inscricao: { slidesPerView: 3 },
  },
  mobile: {
    destaque: { slidesPerView: 2 },
    inscricao: { slidesPerView: 1.5 },
  },
}

/* ---------- layout derivado ---------- */
const layoutConfig = computed(() => DEVICE_CONFIG[device.value][variant.value])
const slidesPerView = computed(() => layoutConfig.value.slidesPerView)

/* ---------- índice de slides ---------- */
const currentIndex = ref(0)
const swiperInstance = ref(null)

function onSlideChange(swiper) {
  currentIndex.value = swiper.activeIndex
  swiperInstance.value = swiper
}

async function goToSlide(index) {
  await nextTick()
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(index, 500)
  }
}

/* ---------- calculado total de "páginas" visíveis ---------- */
const totalPages = computed(() => {
  const remaining = props.eventos.length - Math.floor(slidesPerView.value)
  return Math.max(1, Math.ceil(remaining) + 1)
})

/* ---------- Swiper config por variante ---------- */
const swiperConfig = computed(() => {
  const baseConfig = {
    modules,
    spaceBetween: variant.value === 'destaque' ? 12 : 20,
    loop: false,
    grabCursor: true,
    mousewheel: { forceToAxis: true },
    on: {
      slideChange: onSlideChange,
    },
  }

  if (variant.value === 'destaque') {
    return {
      ...baseConfig,
      slidesPerView: slidesPerView.value,
      freeMode: {
        enabled: true,
        momentum: true,
        momentumRatio: 1,
        momentumVelocityRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
      },
      freeModeMomentum: true,
      freeModeSticky: false,
    }
  } else {
    // inscricao
    return {
      ...baseConfig,
      slidesPerView: slidesPerView.value,
      centeredSlides: true,
      freeMode: {
        enabled: true,
        momentum: true,
        momentumRatio: 1,
        momentumVelocityRatio: 1,
      },
    }
  }
})

</script>

<template>
  <div class="carrossel-wrapper">
    <div class="viewport-container">
      <swiper
        :modules="modules"
        :slides-per-view="slidesPerView"
        :space-between="variant === 'destaque' ? 12 : 20"
        :loop="false"
        :grab-cursor="true"
        :mousewheel="{ forceToAxis: true }"
        :free-mode-momentum="variant === 'destaque'"
        :centered-slides="variant === 'inscricao'"
        @swiper="(swiper) => { swiperInstance = swiper }"
        @slide-change="onSlideChange"
        :class="{
          'swiper-destaque': variant === 'destaque',
          'swiper-inscricao': variant === 'inscricao',
        }"
      >
        <swiper-slide v-for="(evento, i) in eventos" :key="i">
          <component
            :is="component"
            :evento="evento"
            :class="{ 'card-focus': variant === 'inscricao' }"
            :style="{ cursor: 'pointer' }"
            @click="emit('select', evento)"
          />
        </swiper-slide>
      </swiper>
    </div>

    <!-- Scrollbar com índices clicáveis para ambos carrosséis -->
    <div class="carousel-scrollbar">
      <button
        v-for="i in eventos.length"
        :key="i"
        class="scrollbar-index"
        :class="{ active: currentIndex === i - 1 }"
        @click="goToSlide(i - 1)"
        :aria-label="`Ir para card ${i}`"
        :title="`Card ${i} de ${eventos.length}`"
      />
    </div>

    <!-- Índice em pontos apenas para carrossel de destaques -->
  </div>
</template>

<style scoped>
.carrossel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

/* ===== VIEWPORT CONTAINER - Alinhado com margens da página ===== */
.viewport-container {
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: left;
}

/* ===== SWIPER BASE ===== */
:deep(.swiper) {
  width: 100%;
  overflow: hidden;
  border-radius: 0;
  padding: 1rem 0;
  box-sizing: border-box;
}

:deep(.swiper-wrapper) {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

:deep(.swiper-slide) {
  height: auto;
  display: flex;
  justify-content: justify;
  align-items: center;
}

/* ===== CARROSSEL DESTAQUE (Stories Style) ===== */
.swiper-destaque {
  width: 100%;
  box-sizing: border-box;
}

/* ===== CARROSSEL INSCRIÇÃO (Centered Focus) ===== */
.swiper-inscricao {
  width: 100%;
  box-sizing: border-box;
}

/* Cards com foco central - escala e transição */
:deep(.swiper-inscricao .swiper-slide) {
  opacity: 0.7;
  transition: opacity 0.4s ease, transform 0.4s ease;
  transform: scale(0.95);
}

:deep(.swiper-inscricao .swiper-slide-active) {
  opacity: 1;
  transform: scale(1.05);
  filter: brightness(1.1);
}

:deep(.swiper-inscricao .swiper-slide-next) {
  opacity: 0.85;
  transform: scale(0.98);
}

/* ===== PAGINATION DOTS ===== */
.carousel-pagination {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.pagination-dot:hover {
  border-color: #999;
  transform: scale(1.2);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.pagination-dot.active {
  background-color: #0b513f;
  border-color: #0b513f;
  box-shadow: 0 0 12px rgba(11, 81, 63, 0.4);
}

/* ===== SCROLLBAR COM ÍNDICES CLICÁVEIS ===== */
.carousel-scrollbar {
  width: 100%;
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: 10px;
}

.carousel-scrollbar::-webkit-scrollbar {
  height: 4px;
}

.carousel-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.carousel-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(11, 81, 63, 0.3);
  border-radius: 10px;
}

.scrollbar-index {
  width: 12px;
  height: 12px;
  min-width: 12px;
  min-height: 12px;
  padding: 0;
  border-radius: 50%;
  border: 2px solid rgba(11, 81, 63, 0.4);
  background-color: rgba(11, 81, 63, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.scrollbar-index:hover {
  background-color: rgba(11, 81, 63, 0.3);
  border-color: #0b513f;
  transform: scale(1.2);
}

.scrollbar-index.active {
  background-color: #0b513f;
  border-color: #0b513f;
  box-shadow: 0 2px 8px rgba(11, 81, 63, 0.4);
  transform: scale(1.3);
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 767px) {
  .carrossel-wrapper {
    gap: 1rem;
  }

  :deep(.swiper) {
    padding: 1rem 0;
  }

  .pagination-dot {
    width: 8px;
    height: 8px;
  }

  .carousel-scrollbar{
    display: none;
  }
}
  

/* Garante que clique e arraste funciona em toda a área */
:deep(.swiper) {
  cursor: grab;
}

:deep(.swiper.swiper-grabbing) {
  cursor: grabbing;
}

:deep(.swiper-slide) {
  height: auto;
  display: flex;
  /* justify-content: left; */
  align-items: left;
  margin-right: 5px;
}
</style>