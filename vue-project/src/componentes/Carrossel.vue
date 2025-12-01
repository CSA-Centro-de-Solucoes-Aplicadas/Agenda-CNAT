<script setup>
import { ref, onMounted, nextTick, computed, watch, onBeforeUnmount } from 'vue'
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
const translateX = ref(0)
if (props.component === CardInscricao) {
  currentIndex.value = 1
}
const cardsPerPage = ref(1)
function updateCardsPerPage() {
  if (props.component === CardDestaque) {
    if (window.innerWidth >= 1024) {
      cardsPerPage.value = 4
    } else if (window.innerWidth >= 900) {
      cardsPerPage.value = 3
    } else {
      cardsPerPage.value = 2
    }
  } else if (props.component === CardInscricao) {
    if (window.innerWidth >= 1024) {
      cardsPerPage.value = 3
    } else if (window.innerWidth >= 768) {
      cardsPerPage.value = 2
    } else {
      cardsPerPage.value = 1
    }
  } else {
    cardsPerPage.value = 1
  }
}

const moveBy = computed(() => {
  // move 3 itens por passo quando for o componente de destaque
  // return props.component === CardDestaque ? 3 : 1
  return 1
})

const visibleCount = computed(() => {
  // quantos itens ficam visíveis ao mesmo tempo para cada tipo
  return props.component === CardDestaque ? 3 : 1
})

const canNext = computed(() => {
  const maxStart = Math.max(0, props.itens.length - cardsPerPage.value)
  return currentIndex.value < maxStart
})

const canPrev = computed(() => currentIndex.value > 0)

onMounted(async () => {
  updateCardsPerPage()
  await nextTick()
  slides.value = Array.from(container.value.children)
  if (slides.value.length > 0) {
    slideWidth.value = slides.value[0].clientWidth
  }
  // position translate according to initial emphasis
  nextTick().then(updateTranslate)
})
function updateTranslate() {
  const vp = viewport.value
  const cont = container.value
  if (!vp || !cont) return

  slides.value = Array.from(cont.children)

  const vpWidth = vp.clientWidth
  const idx = currentIndex.value
  const target = slides.value[idx]
  if (!target) return

  const totalWidth = cont.scrollWidth

  // centro absoluto do card em relação ao container
  const targetCenter = target.offsetLeft + target.offsetWidth / 2

  // posição desejada: card centrado

  let offset = targetCenter - vpWidth / 2
  if (props.component === CardDestaque) {
    offset = target.offsetLeft
  }

  // Permitir espaços nas extremidades somente para o carrossel de inscrições.
  // Para outros componentes (ex.: CardDestaque) manter o comportamento
  // original que evita mostrar áreas vazias na esquerda/direita.
  const isInscricao = props.component === CardInscricao
  if (isInscricao) {
    // espaço mínimo (quando o primeiro card estiver no centro) — permite
    // deslocar o container para a direita, mostrando espaço vazio à esquerda
    const minOffset = -(vpWidth / 2 - target.offsetWidth / 2)
    // espaço máximo (quando o último card estiver no centro) — permite
    // deslocar o container para a esquerda, mostrando espaço vazio à direita
    const maxOffset = totalWidth - target.offsetWidth / 2 - vpWidth / 2
    offset = Math.max(minOffset, Math.min(offset, maxOffset))
  } else {
    // comportamento antigo: não mostrar áreas vazias
    offset = Math.max(0, Math.min(offset, totalWidth - vpWidth))
  }

  translateX.value = offset
}

function moveToIndex(index) {
  currentIndex.value = index
  nextTick().then(updateTranslate)
  console.log('dots: currentIndex', currentIndex.value, 'translate', translateX.value)
}

const onResize = () => {
  updateCardsPerPage()
  updateTranslate()
}
window.addEventListener('resize', onResize)
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

watch([currentIndex, () => props.itens], () => {
  // recalc when emphasis or items change
  nextTick().then(updateTranslate)
})
// const slideSize = computed(() => {
//   if (props.component === CardDestaque) {
//     return slideWidth.value * 3 // anda 1 card
//   } else if (props.component === CardInscricao) {
//     return slideWidth.value // anda 3 cards
//   }
//   return slideWidth.value
// })
const totalPages = computed(() => {
  if (props.component === CardDestaque) {
    return Math.ceil(props.itens.length - cardsPerPage.value) // 1 card por página
  } else if (props.component === CardInscricao) {
    return Math.ceil(props.itens.length) // 3 cards por página
  }
  return props.itens.length
})

// function calculateCardsPerPage() {
//   if (props.component === CardDestaque) {
//     cardsPerPage.value = 1
//   } else if (props.component === CardInscricao) {
//     cardsPerPage.value = 4
//   } else {
//     cardsPerPage.value = 1
//   }
// }

function proximo() {
  const maxStart = Math.max(0, props.itens.length - cardsPerPage.value)
  const maxIndex = totalPages.value - 1
  if (currentIndex.value < maxStart) {
    currentIndex.value = Math.min(currentIndex.value + moveBy.value, maxStart)
    nextTick().then(updateTranslate)
    console.log('prev: currentIndex', currentIndex.value, 'translate', translateX.value)
  }
}

function anterior() {
  if (currentIndex.value > 0) {
    currentIndex.value = Math.max(0, currentIndex.value - moveBy.value)
    nextTick().then(updateTranslate)
    console.log('prev: currentIndex', currentIndex.value, 'translate', translateX.value)
  }
}
console.log('cardsPerPage', cardsPerPage.value)
</script>
<template>
  <div class="carrossel-wrapper">
    <div class="carrossel" :class="{ CarrosselInscricao: props.component === CardInscricao }">
      <ButtonSeta class="seta esquerda" @click="anterior" :disabled="!canPrev" />

      <div class="viewport" ref="viewport">
        <div
          class="Itens"
          :class="{
            ItensInscricao: props.component === CardInscricao,
            ItensDestaque: props.component === CardDestaque,
          }"
          ref="container"
          :style="{ transform: `translateX(${-translateX}px)` }"
        >
          <component
            v-for="(item, i) in itens"
            :key="i"
            :is="component"
            :item="item"
            :class="{ emphasis: i === currentIndex && component === CardInscricao }"
          />
        </div>
      </div>

      <ButtonSeta
        class="seta direita"
        @click="proximo"
        :disabled="!canNext"
        style="transform: scaleX(-1); cursor: pointer"
      />
    </div>

    <!-- Indicador de páginas em formato de círculos -->
    <div class="pagination-dots">
      <button
        v-for="page in totalPages"
        :key="page - 1"
        class="dot"
        :class="{ active: currentIndex === page - 1 }"
        @click="moveToIndex(page - 1)"
        :aria-label="`Ir para página ${page - 1}`"
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
  max-width: 90vw;
  overflow: hidden;
  margin: auto;
}

.CarrosselInscricao {
  max-width: 70vw;
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
