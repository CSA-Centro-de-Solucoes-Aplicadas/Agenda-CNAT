<script setup>
const props = defineProps({
  item: Object,
})
</script>
<template>
  <div class="cardevento">
    <div class="cardheader">
      <h3>
        {{ item.titulo }}
      </h3>
      <p class="local">{{ item.local }}</p>
    </div>
    <div class="cardbody">
      <ul class="timeline">
        <li>
          <p class="data">
            {{ item.datas[0].data }} <br />
            {{ item.datas[0].hora }}
          </p>
          <p class="descricao">{{ item.datas[0].descricao }}</p>
        </li>
        <li>
          <p class="data">
            {{ item.datas[item.datas.length - 1].data }} <br />
            {{ item.datas[item.datas.length - 1].hora }}
          </p>
          <p class="descricao">{{ item.datas[item.datas.length - 1].descricao }}</p>
        </li>
      </ul>
    </div>
    <div class="cardfooter">
      <p>{{ item.categoria }}</p>
      <img src=""></img>
    </div>
  </div>
</template>
<style scoped>
* {
  margin: 0;
}
.cardevento {
  background-image: url('@/assets/images/illustrations/CardInscricoes_background.png');
  background-size: cover;
  background-position: center;
  max-width: 345px;
  width: 100%;
  border-radius: 16px;
  padding: 28px 28px 5px 28px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.5rem;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease, 
              transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: grab;
}

.cardevento:active {
  cursor: grabbing;
}

h3 {
  font-size: 1rem;
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
.local {
  font-size: 0.85rem;
  color: #575757;
}
.descricao {
  font-size: 0.75rem;
}
.data {
  font-size: 0.68rem;
  font-weight: normal;
}
.cardfooter {
  justify-content: right;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: flex-end;
  width: 100%;
}
</style>
