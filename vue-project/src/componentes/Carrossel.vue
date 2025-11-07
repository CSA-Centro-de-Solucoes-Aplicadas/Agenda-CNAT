<script setup>
import CardDestaque from './CardDestaque.vue'
const props = defineProps({
  itens: Array,
  component: Object,
})
</script>
<template>
  <div class="carrossel">
    <div class="itens" ref="container">
      <component v-for="(item, i) in itens" :key="i" :is="component" :item="item" />
    </div>
  </div>
</template>
<style scoped>
.carrossel {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 10px;
  display: flex;
  gap: 15px;
}
.carrossel > * {
  scroll-snap-align: start;
}
</style>
