<script setup>
import CardDestaque from './CardDestaque.vue'
import ButtonSeta from './ButtonSeta.vue'
import { ref, onMounted, nextTick, computed } from 'vue'
import CardInscricao from './CardInscricao.vue'
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

onMounted(async () => {
  await nextTick()
  slides.value = Array.from(container.value.children)
  if (slides.value.length > 0) {
    slideWidth.value = slides.value[0].clientWidth
  }
})
const slideSize = computed(() => {
  if (props.component === CardDestaque) {
    return slideWidth.value * 3 // anda 3 cards
  } else if (props.component === CardInscricao) {
    return slideWidth.value * 1.2 // anda 1 cards
  }
  return slideWidth.value
})

function proximo() {
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
  <div class="carrossel">
    <ButtonSeta
      class="seta esquerda"
      @click="anterior"
      :disabled="!loop && currentIndex === 0"
    ></ButtonSeta>
    <div class="viewport" ref="viewport">
      <div
        class="Itens"
        :class="{
          ItensInscricao: props.component === CardInscricao,
          ItensDestaque: props.component === CardDestaque,
        }"
        ref="container"
        :style="{
          transform: `translateX(-${currentIndex * slideSize}px)`,
        }"
      >
        <component
          v-for="(item, i) in itens"
          :key="i"
          :is="component"
          :item="item"
          :class="{
            emphasis: props.component === CardInscricao && i === emphasisIndex,
          }"
        />
      </div>
    </div>

    <ButtonSeta
      class="seta direita"
      @click="proximo"
      :disabled="!loop && currentIndex === itens.length - 1"
      style="transform: scaleX(-1)"
    ></ButtonSeta>
  </div>
</template>
<style scoped>
.carrossel {
  display: flex;
  align-items: center;
  position: relative;
  gap: 1rem;
  max-width: 1340px;
  overflow: hidden;
  margin: auto;
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
  z-index: 2;
}
</style>
