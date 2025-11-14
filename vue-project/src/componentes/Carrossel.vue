<script setup>
import CardDestaque from './CardDestaque.vue'
import ButtonSeta from './ButtonSeta.vue'
import { ref, onMounted, nextTick } from 'vue'
const props = defineProps({
  itens: Array,
  component: Object,
})
const container = ref(null)
const viewport = ref(null)
const slides = ref([])
const currentIndex = ref(0)
const slideWidth = ref(0)

onMounted(async () => {
  await nextTick()
  slides.value = Array.from(container.value.children)
  if (slides.value.length > 0) {
    slideWidth.value = slides.value[0].clientWidth
  }
})

function proximo() {
  if (currentIndex.value < props.itens.length - 1) {
    currentIndex.value++
  }
}

function anterior() {
  if (currentIndex.value > 0) {
    currentIndex.value--
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
        class="itens"
        ref="container"
        :style="{
          transform: `translateX(-${currentIndex * slideWidth * 3}px)`,
        }"
      >
        <component v-for="(item, i) in itens" :key="i" :is="component" :item="item" />
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
  width: 80%;
  overflow: hidden;
  margin: auto;
}
.viewport {
  overflow: hidden;
  width: 100%;
  will-change: transform;
}
.itens {
  display: flex;
  transition: transform 0.6s ease; /* suaviza a passagem */
  gap: 2rem;
}
.itens::-webkit-scrollbar {
  display: none;
}
.itens > * {
  scroll-snap-align: start;
  flex: 0 0 auto; /* ocupa 100% da largura da viewport */
}
</style>
