<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import vetorImg from '@/assets/vetor.png'
import Carrossel from '@/componentes/Carrossel.vue'
import CardDestaque from '@/componentes/CardDestaque.vue'
import CardInscricao from '@/componentes/CardInscricao.vue'
import BarradePesquisa from '@/componentes/BarradePesquisa.vue'
import AgendaSemana from '@/componentes/AgendaSemana.vue'
import CalendarioAnualVue from '@/componentes/CalendarioAnual.vue'
import arrowImg from '@/assets/arrow-right.png'
import Header from '@/componentes/header.vue'
import Footer from '@/componentes/footer.vue'
import Modal from '@/componentes/Modal.vue'

// interface de evento
interface Evento {
  titulo: string
  local: string
  descricao: string
  imagem: string
  organizadores?: string[]
  dataInscricaoInicio?: string
  dataInscricaoFim?: string
  dataEventoInicio: string
  dataEventoFim: string
  categorias: string[]
  linkInscricao?: string
}

// props estaticas so para teste
const eventos = ref<Evento[]>([
  {
    titulo: 'Semana de Tecnologia do IFRN',
    local: 'Campus Natal-Central',
    descricao:
      'Uma semana repleta de palestras, workshops e atividades voltadas para o universo da tecnologia.',
    imagem: '',
    dataEventoInicio: '2024-07-15T09:00:00',
    dataEventoFim: '2024-07-19T18:00:00',
    categorias: ['Tecnologia', 'Palestras'],
    linkInscricao: 'https://suap.ifrn.edu.br/',
  },
  {
    titulo: 'Festival Cultural do IFRN',
    local: 'Auditório do Campus Natal-Central',
    descricao:
      'Celebração da diversidade cultural com apresentações artísticas, exposições e gastronomia típica.',
    imagem: '',
    dataEventoInicio: '2024-08-05T10:00:00',
    dataEventoFim: '2024-08-07T22:00:00',
    categorias: ['Cultura'],
    linkInscricao: 'https://suap.ifrn.edu.br/',
  },
  {
    titulo: 'Torneio de Futsal Intercampi',
    local: 'Ginásio Poliesportivo do IFRN',
    descricao:
      'Competição esportiva entre os campi do IFRN, promovendo integração e espírito esportivo.',
    imagem: '',
    dataEventoInicio: '2024-09-10T14:00:00',
    dataEventoFim: '2024-09-12T20:00:00',
    categorias: ['Esporte'],
    linkInscricao: 'https://suap.ifrn.edu.br/',
  },
  {
    titulo: 'Semana de Saúde e Bem-Estar',
    local: 'Campus Natal-Central',
    descricao:
      'Atividades e palestras focadas em saúde física e mental, promovendo o bem-estar da comunidade acadêmica.',
    imagem: '',
    dataEventoInicio: '2024-10-01T08:00:00',
    dataEventoFim: '2024-10-05T17:00:00',
    categorias: ['Saúde'],
    linkInscricao: 'https://suap.ifrn.edu.br/',
  },
  {
    titulo: 'Palestra sobre Inovação Tecnológica',
    local: 'Auditório do Campus Natal-Central',
    descricao:
      'Palestra com especialistas discutindo as últimas tendências em inovação tecnológica.',
    imagem: '',
    dataEventoInicio: '2024-11-20T15:00:00',
    dataEventoFim: '2024-11-20T17:00:00',
    categorias: ['Tecnologia', 'Palestras'],
    linkInscricao: 'https://suap.ifrn.edu.br/',
  },
])

// const separarDataHora = (dataISO?: string) => {
//   if (!dataISO) return { data: '--/--/--', hora: '--:--' }

//   const dataObj = new Date(dataISO)
//   const dataFormatada = dataObj.toLocaleDateString('pt-BR')
//   const horaFormatada = dataObj.toLocaleTimeString('pt-BR', {
//     hour: '2-digit',
//     minute: '2-digit',
//   })

//   return { data: dataFormatada, hora: horaFormatada }
// }

// lógica para abrir modal
const ShowModal = ref(false)
const EventoSelecionado = ref<Evento | null>(null)

watch(ShowModal, (novoValor) => {
  if (novoValor) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

onMounted(() => {
  document.body.style.overflow = 'auto'
})

function AbrirModal(eventoClicado: Evento) {
  EventoSelecionado.value = eventoClicado
  ShowModal.value = true
}
function FecharModal() {
  ShowModal.value = false
  EventoSelecionado.value = null
}
</script>

<template>
  <div class="page">
    <Header />
    <main class="main-content">
      <BarradePesquisa class="barra-pesquisa" />
      <section class="destaques-default-section">
        <div class="content-container">
          <!-- <Carrossel :itens="eventos" :component="CardDestaque" @select="AbrirModal" /> -->
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
          <!-- <Carrossel :itens="eventos" :component="CardInscricao" /> -->
        </div>
      </section>
    </main>
    <Footer />
    <Teleport to="body">
      <Transition name="fade">
        <Modal
          v-if="ShowModal && EventoSelecionado"
          :eventoSelecionado="EventoSelecionado"
          @close="FecharModal"
        />
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
/* modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
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
  padding: 30px;
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

  .content-container {
    padding: 0 40px;
  }
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
  .destaques-default-section {
    padding-bottom: 0px;
  }

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
