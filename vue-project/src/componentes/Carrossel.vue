<script setup>
import CardDestaque from './CardDestaque.vue'
import ButtonSeta from './ButtonSeta.vue'
import { ref } from 'vue'
const props = defineProps({
  itens: Array,
  component: Object,
})
const container = ref(null)
function scrollLeft() {
  if (container.value) {
    container.value.scrollBy({
      left: -300,
      behavior: 'smooth',
    })
  }
}
function scrollRight() {
  if (container.value) {
    container.value.scrollBy({
      left: 300,
      behavior: 'smooth',
    })
  }
}
</script>
<template>
  <div class="carrossel">
    <ButtonSeta @click="scrollLeft"></ButtonSeta>
    <div class="itens" ref="container">
      <component v-for="(item, i) in itens" :key="i" :is="component" :item="item" />
    </div>
    <ButtonSeta @click="scrollRight" style="transform: scaleX(-1)"></ButtonSeta>
  </div>
</template>
<style scoped>
.carrossel {
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.carrossel > * {
}
.itens {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  max-width: 60vw;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
}
.itens::-webkit-scrollbar {
  display: none;
}
.itens > * {
  scroll-snap-align: start;
}
</style>
