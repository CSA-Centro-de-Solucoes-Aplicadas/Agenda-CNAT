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
const emphasisIndex = ref(1)

const moveBy = computed(() => {
  // move 3 itens por passo quando for o componente de destaque
  return props.component === CardDestaque ? 3 : 1
})

const visibleCount = computed(() => {
  // quantos itens ficam visíveis ao mesmo tempo para cada tipo
  return props.component === CardDestaque ? 3 : 1
})

const canNext = computed(() => {
  const maxStart = Math.max(0, props.itens.length - visibleCount.value)
  return currentIndex.value < maxStart
})

const canPrev = computed(() => currentIndex.value > 0)

onMounted(async () => {
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
  const idx = emphasisIndex.value
  const target = slides.value[idx]
  if (!target) return

  const totalWidth = cont.scrollWidth

  // centro absoluto do card em relação ao container
  const targetCenter = target.offsetLeft + target.offsetWidth / 2

  // posição desejada: card centrado
  let offset = targetCenter - vpWidth / 2

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

const onResize = () => updateTranslate()
window.addEventListener('resize', onResize)
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

watch([emphasisIndex, () => props.itens], () => {
  // recalc when emphasis or items change
  nextTick().then(updateTranslate)
})
const slideSize = computed(() => {
  if (props.component === CardDestaque) {
    return slideWidth.value * 3 // anda 1 card
  } else if (props.component === CardInscricao) {
    return slideWidth.value // anda 3 cards
  }
  return slideWidth.value
})

function proximo() {
  const maxStart = Math.max(0, props.itens.length - visibleCount.value)
  if (currentIndex.value < maxStart) {
    currentIndex.value = Math.min(currentIndex.value + moveBy.value, maxStart)
    emphasisIndex.value = Math.min(emphasisIndex.value + moveBy.value, props.itens.length - 1)
    nextTick().then(updateTranslate)
  }
}

function anterior() {
  if (currentIndex.value > 0) {
    currentIndex.value = Math.max(0, currentIndex.value - moveBy.value)
    emphasisIndex.value = Math.max(0, emphasisIndex.value - moveBy.value)
    nextTick().then(updateTranslate)
    console.log(
      'prev: currentIndex',
      currentIndex.value,
      'emphasis',
      emphasisIndex.value,
      'translate',
      translateX.value,
    )
  }
}
</script>
<template>
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
          :class="{ emphasis: i === emphasisIndex && component === CardInscricao }"
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
</template>

<style scoped>
.carrossel {
  display: flex;
  align-items: center;
  position: relative;
  gap: 0.875rem;
  max-width: 80vw;
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
  gap: 1.5rem;
}

.Itens::-webkit-scrollbar {
  display: none;
}

.Itens > * {
  scroll-snap-align: start;
  flex: 0 0 auto;
  /* ocupa 100% da largura da viewport */
}

.ItensDestaque > *:hover {
  transform: scale(1.05);
  transition: transform 0.4s ease;
}

.emphasis {
  transform: scale(1.2);
  transition: transform 0.6s ease;
  /* z-index: 2; deixa na frente */
}
</style>
