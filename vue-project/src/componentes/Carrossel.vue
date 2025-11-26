<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import CardDestaque from './CardDestaque.vue'
import CardInscricao from './CardInscricao.vue'
import ButtonSeta from './ButtonSeta.vue'

const props = defineProps({
  itens: Array,
  component: Object,
})

const container = ref(null)
const viewport = ref(null)
const slides = ref([])
const currentIndex = ref(0)
const slideWidth = ref(0)
const emphasisIndex = ref(1)
const cardsPerPage = ref(1)

onMounted(async () => {
  await nextTick()
  slides.value = Array.from(container.value.children)
  if (slides.value.length > 0) {
    slideWidth.value = slides.value[0].clientWidth
    calculateCardsPerPage()
  }
})

const slideSize = computed(() => {
  if (props.component === CardDestaque) {
    return slideWidth.value * 3 // anda 1 card
  } else if (props.component === CardInscricao) {
    return slideWidth.value // anda 3 cards
  }
  return slideWidth.value
})

const totalPages = computed(() => {
  if (props.component === CardDestaque) {
    return Math.ceil(props.itens.length / 1) // 1 card por página
  } else if (props.component === CardInscricao) {
    return Math.ceil(props.itens.length / 3) // 3 cards por página
  }
  return props.itens.length
})

const currentPage = computed(() => {
  if (props.component === CardDestaque) {
    return Math.floor(currentIndex.value / 1) + 1
  } else if (props.component === CardInscricao) {
    return Math.floor(currentIndex.value / 3) + 1
  }
  return currentIndex.value + 1
})

function calculateCardsPerPage() {
  if (props.component === CardDestaque) {
    cardsPerPage.value = 1
  } else if (props.component === CardInscricao) {
    cardsPerPage.value = 3
  } else {
    cardsPerPage.value = 1
  }
}

function goToPage(pageNumber) {
  currentIndex.value = (pageNumber - 1) * cardsPerPage.value
  if (props.component === CardInscricao) {
    emphasisIndex.value = currentIndex.value + 1
  }
}

function proximo() {
  const maxIndex = totalPages.value - 1
  if (currentIndex.value < props.itens.length - 1) {
    currentIndex.value = (currentIndex.value + 1) % props.itens.length
    emphasisIndex.value++
  }
}

function anterior() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    emphasisIndex.value--
  }
}
</script>
<template>
  <div class="carrossel-wrapper">
    <div class="carrossel">
      <ButtonSeta class="seta esquerda" @click="anterior" />

      <div class="viewport" ref="viewport">
        <div
          class="Itens"
          :class="{
            ItensInscricao: props.component === CardInscricao,
            ItensDestaque: props.component === CardDestaque,
          }"
          ref="container"
          :style="{ transform: `translateX(-${currentIndex * slideSize}px)` }"
        >
          <component
            v-for="(item, i) in itens"
            :key="i"
            :is="component"
            :item="item"
            :class="{ emphasis: i === emphasisIndex && component === CardInscricao }"
          />
        </div>
      </div>

      <ButtonSeta class="seta direita" @click="proximo" style="transform: scaleX(-1)" />
    </div>

    <!-- Indicador de páginas em formato de círculos -->
    <div class="pagination-dots">
      <button
        v-for="page in totalPages"
        :key="page"
        class="dot"
        :class="{ active: currentPage === page }"
        @click="goToPage(page)"
        :aria-label="`Ir para página ${page}`"
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
  /* position: relative; */
  gap: 1rem;
  max-width: 1200px;
  overflow: hidden;
  margin: auto;
  width: 100%;
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
  /* ocupa 100% da largura da viewport */
}

.Itens > *:hover {
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
</style>
