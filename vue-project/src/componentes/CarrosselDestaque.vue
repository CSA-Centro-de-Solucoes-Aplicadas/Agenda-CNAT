<script>
defineProps({
  itens: Array,
})
import CardDestaque from './CardDestaque.vue'
import CardDestaque from './CardDestaque.vue'
const props = defineProps({
  items: Array,
  component: [Object],
})
</script>
<template>
  <div class="carrossel">
    <CardDestaque
      v-for="(item, i) in itens"
      :key="i"
      :titulo="item.titulo"
      :local="item.local"
      :datas="item.datas"
      :imagem="item.imagem"
    ></CardDestaque>
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
