<script setup>
defineProps({
  titulo: String,
  local: String,
  categoria: String,
  datas: Array,
})
</script>
<template>
  <div class="cardevento">
    <div class="cardheader">
      <h3>
        {{ titulo }}
      </h3>
      <p>{{ local }}</p>
    </div>
    <div class="cardbody">
      <ul class="timeline">
        <li v-for="(item, i) in datas" key="i" :class="{ start: i === 0, end: i === 1 }">
          <span class="data">{{ item.data }} às {{ item.hora }}</span>
          <span class="descricao">{{ item.descricao }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.cardevento {
  background-image: url(imagens/CardInscricoes_background.png);
  background-size: cover;
  background-position: center;
  max-width: 400px;
  width: 32%;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.timeline {
  border-left: 2px solid #222;
  margin-left: 15px;
  padding-left: 15px;
  list-style-type: disc;
}
li {
  padding: 1rem 0;
  position: relative;
  display: flex;
  gap: 1rem;
  align-items: center;
}
li.start::before {
  content: '•';
  font-size: 2.5rem;
  position: absolute;
  left: -23px;
  top: -3px;
  color: #009218;
}
li.end::before {
  content: '•';
  font-size: 2.5rem;
  position: absolute;
  left: -23px;
  top: -3px;
  color: #c62828;
}
.descricao {
  font-size: 1rem;
}
.data {
  font-size: 0.8rem;
  font-weight: lighter;
}
</style>
