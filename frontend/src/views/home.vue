<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import logoImg from '@/assets/logo.svg'
import vetorImg from '@/assets/vetor.png'
import logoFooter from '@/assets/logoFooter.png'
import logoIfrn from '@/assets/ifrn.png'
import XImg from '@/assets/x.png'
import instagramImg from '@/assets/instagram.png'
import youtubeImg from '@/assets/youtube.png'
import Carrossel from '@/componentes/Carrossel.vue'
import CardDestaque from '@/componentes/CardDestaque.vue'
import CardInscricao from '@/componentes/CardInscricao.vue'
import BarradePesquisa from '@/componentes/BarradePesquisa.vue'
import AgendaSemana from '@/componentes/AgendaSemana.vue'
import CalendarioAnualVue from '@/componentes/CalendarioAnual.vue'
import Modal from '@/componentes/Modal.vue'
import arrowImg from '@/assets/arrow-right.png'
import { RouterLink } from 'vue-router'
import Header from '@/componentes/header.vue'
import Footer from '@/componentes/footer.vue'
import { fetchEventos, type PayloadEvento } from '@/services/api'

const eventosApi = ref<PayloadEvento[]>([])
const loading = ref(true)

// Modal
const modalAberto = ref(false)
const eventoSelecionado = ref<PayloadEvento | null>(null)

function abrirModal(item: PayloadEvento) {
  eventoSelecionado.value = item
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  eventoSelecionado.value = null
}

onMounted(async () => {
  try {
    const res = await fetchEventos({ where: { visivel: { equals: true } } })
    eventosApi.value = res.docs
  } catch (err) {
    console.error('Erro ao carregar eventos:', err)
  } finally {
    loading.value = false
  }
})

// Formatar os dados da API para o formato esperado pelos cards
const eventosFormatados = computed(() => {
  return eventosApi.value.map((ev) => {
    const fmtDate = (iso?: string | null) => {
      if (!iso) return ''
      return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }
    const fmtTime = (iso?: string | null) => {
      if (!iso) return ''
      return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }

    return {
      ...ev,
      titulo: ev.titulo,
      local: ev.local || '',
      categoria: ev.categorias?.[0]?.nome || '',
      imagem: ev.imagem,
      datas: [
        {
          data: fmtDate(ev.dataInscricaoInicio),
          hora: fmtTime(ev.dataInscricaoInicio),
          descricao: 'Abertura das inscrições',
        },
        {
          data: fmtDate(ev.dataEventoInicio),
          hora: fmtTime(ev.dataEventoInicio),
          descricao: 'Início do evento',
        },
        {
          data: fmtDate(ev.dataInscricaoFinal),
          hora: fmtTime(ev.dataInscricaoFinal),
          descricao: 'Período final das inscrições',
        },
      ],
    }
  })
})

// Eventos com inscrição aberta
const eventosInscricao = computed(() => {
  const agora = new Date()
  return eventosFormatados.value.filter((ev) => {
    if (ev.dataInscricaoInicio && ev.dataInscricaoFinal) {
      const ini = new Date(ev.dataInscricaoInicio)
      const fim = new Date(ev.dataInscricaoFinal)
      return agora >= ini && agora <= fim
    }
    return true // mostra se não tiver datas de inscrição definidas
  })
})
</script>

<template>
  <div class="page">
    <Header />
    <main class="main-content">
      <BarradePesquisa class="barra-pesquisa" />
      <section class="destaques-default-section">
        <div class="content-container">
          <Carrossel v-if="eventosFormatados.length" :itens="eventosFormatados" :component="CardDestaque" @select="abrirModal" />
          <p v-else-if="!loading" style="text-align:center; color:#888; padding:2rem;">Nenhum evento em destaque.</p>
        </div>
      </section>

      <section id="programacao">
        <div class="content-container">
          <h3>Programação</h3>
          <AgendaSemana></AgendaSemana>
          <CalendarioAnualVue></CalendarioAnualVue>
        </div>
      </section>

      <section id="adicionar-evento" class="adicionar-evento">
        <div class="adicionarEvento-container">
          <img :src="vetorImg" alt="Vetor" class="adicionarEvento-vetor" />
          <div class="adicionarEvento-texto">
            <h3>Quer solicitar algum evento ao nosso calendário?</h3>
            <a href="https://suap.ifrn.edu.br/" target="_blank" class="btn-solicitar-evento">
              <span class="btn-texto">Solicitar Evento</span>

              <span class="btn-icon">
                <img :src="arrowImg" alt="Ir para o SUAP" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section id="inscricoes" class="inscricoes">
        <div class="inscricoes-content">
          <h3>Inscrições abertas</h3>
          <Carrossel v-if="eventosInscricao.length" :itens="eventosInscricao" :component="CardInscricao" @select="abrirModal" />
          <p v-else-if="!loading" style="text-align:center; color:#fff; padding:2rem;">Nenhuma inscrição aberta no momento.</p>
        </div>
      </section>
    </main>

    <!-- Modal de detalhes do evento -->
    <div v-if="modalAberto && eventoSelecionado" class="modal-overlay" @click.self="fecharModal">
      <Modal :evento="eventoSelecionado" @close="fecharModal" />
    </div>

    <Footer/>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
h3 {
  font-size: 32px;
  color: #0b513f;
  margin-top: 0;
}
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.content-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
}

.content-container h3 {
  margin-bottom: 40px;
}

.destaques-default-section {
  width: 100%;
  padding: 5rem 0;
  overflow-x: hidden;
}

.inscricoes {

  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
  border-top-left-radius: 6rem;
  border-bottom-right-radius: 6rem;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/inscricoesSection.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.main-content {
  flex: 1;
  width: 100%;
  overflow-x: hidden;
}

.adicionar-evento {
  position: relative;
  width: 100%;
  padding: 2rem 0;
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  z-index: 1;
}
.adicionar-evento::before {
  content: '';
  position: absolute;
  left: 0;
  top: 32px;
  width: 50%;
  height: 400px;
  background: #ffffff;
  z-index: -1;
}

.adicionarEvento-container {
  max-width: 1440px;
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  gap: 2.5rem;
  background-color: #ffffff;
  justify-content: left;
  align-items: center;
  height: 400px;
  border-top-right-radius: 220px;
}

.adicionarEvento-container::after {
  content: '';
  position: absolute;
  right: -620px;
  top: -70px;
  width: 800px;
  height: 500px;
  background-image: url('@/assets/vetorCirculos.png');
  background-size: contain;
  background-repeat: no-repeat;
  z-index: -1;
}

.adicionarEvento-vetor {
  width: 100%;
  max-width: 32rem;
}

.adicionarEvento-texto {
  flex: 1;
  max-width: 30rem;
  color: #023826;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.adicionarEvento-texto p {
  font-size: 0.95rem;
  color: #4a4a4a;
}

.btn-solicitar-evento {
  margin-top: 1.2rem;
  width: 220px;
  align-items: center;
  gap: 0.5rem;
  display: flex;
  padding: 0.35rem 1.6rem;
  background-color: #39b87f;
  color: #ffffff;
  font-weight: 400;
  font-size: 1.2rem;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 6px 15px rgba(57, 184, 127, 0.35);
  transition: all 0.25s ease;
}

.btn-solicitar-evento:hover {
  background-color: #2fa36e;
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(57, 184, 127, 0.45);
}

.btn-texto {
  line-height: 1;
  white-space: nowrap;
}

.btn-icon img {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.btn-solicitar-evento:hover .btn-icon {
  transform: translateX(4px);
  transition: transform 0.25s ease;
}

.inscricoes-content {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  padding: 30px ;
}

.inscricoes-content h3 {
  color: white;
  font-size: 32px;
  padding: 30px 0 10px 0;
  margin: 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
}
.btn-inscricoes-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

.btn-inscricoes-suap {
  padding: 0.9rem 2.2rem;
  border-radius: 999px;

  background-color: #0b3f2e;
  color: #ffffff;

  font-size: 0.95rem;
  font-weight: 400;
  text-decoration: none;
  letter-spacing: 0.2px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;
}

.btn-inscricoes-suap:hover {
  background-color: #062c20;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
}


.barra-pesquisa {
  display: flex;
  margin: auto;
  width: 100%;
  display: block;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

@media (max-width: 1024px) {

  .adicionarEvento-container {
    padding: 0 24px;
    justify-content: flex-start;
  }

  .adicionarEvento-vetor {
    width: 260px;
    max-width: none;
    margin: 0;
    order: 0;
  }

  .adicionarEvento-texto {
    max-width: 420px;
    text-align: left;
    align-items: flex-start;
  }

  .adicionarEvento-texto h3 {
    font-size: 24px;
  }
}

  .content-container {
    padding: 0 40px;
  }

@media (max-width: 900px) {
  .content-container {
    padding: 0 20px;
  }
  .adicionar-evento::before,
  .adicionarEvento-container::after {
    display: none;
  }

  .adicionarEvento-container {
    flex-direction: column;
    height: auto;
    padding: 30px 20px;
    
  }

  .adicionarEvento-vetor {
    max-width: 260px;
    width: 100%;
  }

  .adicionarEvento-texto {
    max-width: 100%;
    align-items: center;
  }

  .btn-solicitar-evento {
    width: auto;
  }
}

@media (max-width: 750px) {

  .default-section {
    padding: 25px 0;
  }
  h3 {
    font-size: 20px;
    text-align: left;
  }

  .content-container h3 {
    margin-bottom: 40px;
  }

  .content-container {
    padding: 0 16px;
  }

  .adicionar-evento {
   
    padding: 10px 10px;
  }
  .adicionar-vetor {
    width: 60%;
  }
  .inscricoes {
    min-height: 300px;
    border-bottom-right-radius: 30px;
    border-top-left-radius: 30px;
  }
  .inscricoes-content h3 {
    font-size: 22px;
  }

  .btn-solicitar-evento {
    font-size: 1rem;
    padding: 0.6rem 1.4rem;
  }

  .btn-icon img {
    width: 28px;
    height: 28px;
  }

  .inscricoes-content {
    padding: 20px 10px;
  }
  .adicionar-evento::before,
  .adicionarEvento-container::after {
    display: none;
  }

  .adicionarEvento-container {
    flex-direction: column;
    height: auto;
    padding: 30px 20px;
    border-radius: 10px;
    text-align: center;
  }

  .adicionarEvento-vetor {
    max-width: 270px;
    width: 100%;
  }

  .adicionarEvento-texto {
    max-width: 100%;
    align-items: center;
     padding: 0px 35px;
  }

  .btn-solicitar-evento {
    margin-top: 12px;
  }

  .adicionarEvento-texto h3 {
    font-size: 16px;
    line-height: 1.25;
    margin: 10px;
  }

  .adicionarEvento-texto p {
    font-size: 10px;
    line-height: 1.35;
    margin: 0;
    color: #4a4a4a;
  }

  .btn-solicitar-evento {
    margin-top: 8px;

    width: fit-content;
    font-size: 0.65rem;
    padding: 0.25rem 1rem;
  }

  .btn-icon img {
    width: 22px;
    height: 22px;
  }
}
</style>