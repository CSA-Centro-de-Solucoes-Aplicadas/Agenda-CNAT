<script setup lang="ts">
import { ref, computed } from 'vue'
import modalBanner from '@/assets/modalbanner.png'

interface Evento {
  titulo: string
  local: string
  dataInscricaoInicio?: string
  dataInscricaoFim?: string
  dataEventoInicio: string
  dataEventoFim: string
  categorias: string[]
  descricao: string
  linkInformacao?: string
  linkInscricao?: string
  organizadores?: string[]
  imagem: string
}
const props = defineProps<{
  eventoSelecionado: Evento
}>()

const contatosLimitados = computed(() => {
  return props.eventoSelecionado.organizadores?.slice(0, 4)
})

const separarDataHora = (dataISO?: string) => {
  if (!dataISO) return { data: '--/--/--', hora: '--:--' }

  const dataObj = new Date(dataISO);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR');
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return { data: dataFormatada, hora: horaFormatada };
}
const emit = defineEmits(['close'])

const modo = ref('info')

// -- Navegação entre modos desativada por enquanto --
// function next() {
//   modo.value = modo.value === 'info' ? 'imagem' : 'info'
// }

// function prev() {
//   modo.value = modo.value === 'info' ? 'imagem' : 'info'
// }
</script>

<template>
  <div class="modal-overlay">
    <div class="story-wrapper">
      <!-- <div class="progress-wrapper">
        <div class="bar active"></div>
      </div> -->
      <div class="story-card">
        <button class="close-btn" @click="emit('close')">✕</button>

        <div class="left">
          <h1>{{ eventoSelecionado.titulo }}</h1>
        <div class="local-row">
          <div class="local">
            <img src="@/assets/localModal.png" alt="">
            {{ eventoSelecionado.local }}
          </div>

        </div>


          <div class="datas-list">
            <span>{{ separarDataHora(eventoSelecionado.dataEventoInicio).data }} até {{ separarDataHora(eventoSelecionado.dataEventoFim).data }}</span>
            <div class="horario">
                {{ separarDataHora(eventoSelecionado.dataEventoInicio).hora }} – {{ separarDataHora(eventoSelecionado.dataEventoFim).hora }}
            </div>
          </div>

          <p class="descricao">{{ eventoSelecionado.descricao }}</p>

          <div class="contatos-box">
            <h2>Organizadores</h2>
            <div class="contatos-grid" v-if="contatosLimitados && contatosLimitados.length > 0">
              <div
                class="contato-item"
                v-for="(c, i) in contatosLimitados"
                :key="i"
                :class="{ single: contatosLimitados.length === 1 }"
              >
                <img src="@/assets/contato.png" class="user-icon" />
                <span>{{ c }}</span>
              </div>
            </div>

            <div v-else class="sem-contatos">
              Não há contatos cadastrados
            </div>

          </div>

          <div class="footer">
            <a :href="eventoSelecionado.linkInformacao" class="mais-info" target="_blank">mais informações</a>
            <!-- <div class="categoria-box">
              <strong v-for="(p, i) in evento.palestras" :key="i">{{ p }}</strong>
            </div> -->
          </div>
        </div>

        <div class="right">
          <img :src="eventoSelecionado.imagem" class="side-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.close-btn {
  position: absolute;
  top: 18px;
  right: 20px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #333;
  z-index: 20;

  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f0f0f0;
}

.progress-wrapper {
  position: absolute;
  top: 20px;
  left: 135px;
  display: flex;
  gap: 8px;
}

.bar {
  width: 150px;
  height: 7px;
  background: #e5e5e5;
  border-radius: 999px;
}

.bar.active {
  background: linear-gradient(90deg, #5ea4ef, #6fe0a5);
}
.story-card {
  width: 850px;
  position: relative;
  min-height: 600px; 
  max-height: 85vh;  
  height: 650px;
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
}


.left {
  flex: 1;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  overflow-y: auto; 
}

h1 {
  font-size: 36px;
  margin-top: 5px;
  margin-left: 90px;
  margin-bottom: 5px;
}
h2 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #1d5b3d;
}
.right {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.side-image {
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.datas-list {
  background: #dff5e4;
  display: flex;
  padding: 16px;
  border-radius: 16px;
  height: auto;
}
.datas-list span {
  font-size: 14px;
  margin-left: 20px;
  color: #559e67;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.mais-info {
  font-size: 14px;
  color: #4b4b4b;
  text-decoration: underline;
  cursor: pointer;
}

.categoria-box {
  display: flex;
  justify-content: flex-end;
  width: 50%;
}

.categoria-box strong {
  font-size: 15px;
  margin-left: auto;
}


.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.arrow-btn:hover {
  transform: scale(1.35);
}

.local-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 70px;
}

.local {
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
}

.local img {
  margin-right: 6px;
}

.horario {
  font-size: 14px;

  color:#559e67;
  padding-left: 30px;

}


.descricao {
  color: #6e6e6e;
  font-size: 14px;
  width: 90%;
  margin-left: 15px;
}

.contatos-box {
  background: #e4f3ea;
  padding: 18px;
  border-radius: 16px;
  width: 100%;
}

.contatos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 12px;
}

.contato-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  padding: 10px;
  border-radius: 10px;
}
.sem-contatos{
  font-size: 13px;
  color: #6e6e6e;
}
.user-icon {
  width: 20px;
  opacity: 0.7;
}
@media (max-width: 768px) {
  .story-card {
    width: 100vw;
    min-height: 100vh;
    height: auto;              
    max-height: none;
    border-radius: 0;
    flex-direction: column;
    overflow: visible;         
  }

  .left {
    padding: 16px;
    gap: 14px;
    flex: none;                
  }

  .right {
    width: 100%;
    height: 220px;             
    flex: none;
  }

  .side-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  h1 {
    font-size: 28px;
    margin-left: 0;
    text-align: center;
  }

  .local-row {
    margin-left: 0;
    justify-content: center;
  }

  .datas-list {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    align-items: center;
  }
  .horario {
    padding-left: 0;
    font-size: 13px;
  }

   h1 {
    margin-left: 0;
    margin-bottom: 8px;
  }

  .descricao {
    margin: 0;
    margin-bottom: 8px;
  }


  .footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .categoria-box {
    width: 100%;
    justify-content: flex-start;
  }

  .progress-wrapper {
    left: 50%;
    transform: translateX(-50%);
  }
   .contatos-box {
    padding: 14px;
  }

  .contatos-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .contato-item {
    padding: 8px 10px;
    font-size: 12px;
  }

  .user-icon {
    width: 16px;
  }
}

</style>