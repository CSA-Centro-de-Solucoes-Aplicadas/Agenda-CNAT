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
        <li>
          <p>{{ datas[0].data }} <br> {{ datas[0].hora }}</p>
          <p>{{ datas[0].descricao }}</p>
        </li>
        <li>
          <p>{{ datas[datas.length -1].data }} <br> {{ datas[datas.length -1].hora }}</p>
          <p>{{ datas[datas.length-1].descricao }} </p>
        </li>
      </ul>
    </div>
    <div class="cardfooter">
      <p>{{categoria}}</p>
      <img src=""></img>
    </div>
  </div>
</template>
<style scoped>
.cardevento {
  background-image: url(imagens/CardInscricoes_background.png);
  background-size: cover;
  background-position: center;
  max-width: 400px;
  width: 100%;
  border-radius: 16px;
  padding: 28px 28px 18px 28px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.timeline {
  border-left: 2px solid #222;
  margin-left: 15px;
  padding-left: 15px;
  list-style-type: disc;
}
li {
  padding: 0.5rem 0;
  position: relative;
  display: flex;
  gap: 1rem;
  align-items: center;
}
li:first-child::before {
  content: '•';
  font-size: 2.5rem;
  position: absolute;
  left: -24px;
  top: -2px;
  color: #009218;
}
li:last-child:before {
  content: '•';
  font-size: 2.5rem;
  position: absolute;
  left: -24px;
  top: 0;
  color: #c62828;
}
.descricao {
  font-size: 1rem;
}
.data {
  font-size: 0.8rem;
  font-weight: lighter;
}
.cardfooter{
  justify-content: right;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: flex-end;
  width: 100%;
}
.cardfooter p{
}
</style>
