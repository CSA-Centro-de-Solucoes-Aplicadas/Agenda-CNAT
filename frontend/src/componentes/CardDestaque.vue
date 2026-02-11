<script setup>
import { computed } from 'vue'
import { getMediaUrl } from '@/services/api'
import fundoDestaqueDefault from '@/assets/images/illustrations/fundodestaque.png'

const props = defineProps({
  item: Object
})
import localImg from '@/assets/images/icons/local.svg'
import calendario_horaImg from '@/assets/images/icons/calendario_hora.svg'

const backgroundImage = computed(() => {
  const url = getMediaUrl(props.item?.imagem)
  return url || fundoDestaqueDefault
})

const dataFormatada = computed(() => {
  if (props.item?.dataEventoInicio) {
    return new Date(props.item.dataEventoInicio).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit'
    })
  }
  // fallback para formato antigo
  if (props.item?.datas?.[1]?.data) return props.item.datas[1].data
  return ''
})
</script>
<template>
  <div class="carddestaque" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <h3>{{ item.titulo }}</h3>
    <div class="local">
      <img :src="localImg">
      <p>{{ item.local }}</p>
    </div>
    <div class="data">
      <img :src="calendario_horaImg">
      <p>{{ dataFormatada }}</p>
    </div>
  </div>
</template>
<style scoped>
.carddestaque {
  aspect-ratio: 260 / 510; 
  width: 100%;           
  max-width: 260px; 
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 15px;
  box-sizing: border-box;
  cursor: grab;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              box-shadow 0.3s ease;
}

.carddestaque:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.carddestaque:active {
  cursor: grabbing;
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
.local, .data{
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .carddestaque {
    max-width: 220px;
    border-radius: 16px;
    padding: 12px;
  }

  h3 {
    font-size: 16px;
    line-height: 1.2;
  }

  p {
    font-size: 14px;
  }

  .local,
  .data {
    gap: 0.6rem;
    align-items: center;
  }

  .local img,
  .data img {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .carddestaque {
    max-width: 190px;
    aspect-ratio: 220 / 420;
    padding: 10px;
  }

  h3 {
    font-size: 14px;
  }

  p {
    font-size: 13px;
  }

  .local img,
  .data img {
    width: 16px;
    height: 16px;
  }
}

</style>
