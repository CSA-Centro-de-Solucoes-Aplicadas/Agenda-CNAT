<script setup>
defineProps({
  titulo: String,
  local: String,
  datas: Array,
  imagem: String,
})
</script>
<template>
  <div class="carddestaque">
    <h3>{{ titulo }}</h3>
    <div class="local">
      <!-- <img>{}</img> -->
      <p>{{ local }}</p>
    </div>
    <div class="data">
      <!-- <img></img> -->
      <p>{{ datas[1].data }}</p>
    </div>
  </div>
</template>
<style scoped>
.carddestaque {
  background-image: url(imagens/fundodestaque.png);
  background-size: cover;
  background-position: center;
  border-radius: 20px 20px 20px 20px;
  position: relative;
  max-width: 265px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: start;
  padding: 15px;
  box-sizing: border-box;
  min-height: 560px;
}
.carddestaque::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  border-radius: 20px;
  z-index: 0;
}
.carddestaque > * {
  position: relative;
  z-index: 1;
}
p {
  color: white;
}
h3 {
  color: white;
}
</style>
