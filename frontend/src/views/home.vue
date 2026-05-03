<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import arrowImg from '@/assets/images/arrow-right.png'
import vetorImg from '@/assets/vetor.png'
import AgendaSemana from '@/componentes/AgendaSemana.vue'
import CalendarioAnualVue from '@/componentes/CalendarioAnual.vue'
import CardDestaque from '@/componentes/CardDestaque.vue'
import CardInscricao from '@/componentes/CardInscricao.vue'
import Carrossel from '@/componentes/Carrossel.vue'
import Footer from '@/componentes/footer.vue'
import Header from '@/componentes/header.vue'
import Modal from '@/componentes/Modal.vue'
import { listEvents } from '@/services/events'
import type { EventRecord } from '@/types/event'
import { isRegistrationOpen } from '@/utils/date'

const events = ref<EventRecord[]>([])
const selectedEvent = ref<EventRecord | null>(null)
const showModal = ref(false)
const loading = ref(true)
const error = ref('')

const highlightedEvents = computed(() => events.value.slice(0, 6))
const registrationEvents = computed(() =>
  events.value.filter((event) =>
    isRegistrationOpen(event.dataInscricaoInicio, event.dataInscricaoFim),
  ),
)

watch(showModal, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : 'auto'
})

onMounted(loadEvents)

async function loadEvents() {
  loading.value = true
  error.value = ''

  try {
    events.value = await listEvents()
  } catch {
    error.value = 'Não foi possível carregar os eventos. Tente novamente em instantes.'
  } finally {
    loading.value = false
  }
}

function openModal(event: EventRecord) {
  selectedEvent.value = event
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedEvent.value = null
}
</script>

<template>
  <div class="page">
    <Header :eventos="events" @select="openModal" />

    <main class="main-content">
      <section class="destaques-default-section">
        <div class="content-container">
          <div v-if="loading" class="feedback-card">Carregando eventos...</div>
          <div v-else-if="error" class="feedback-card feedback-card--error">
            {{ error }}
            <button type="button" class="retry-button" @click="loadEvents">Tentar novamente</button>
          </div>
          <div v-else>
            <Carrossel :eventos="highlightedEvents" :component="CardDestaque" @select="openModal" />
          </div>
        </div>
      </section>

      <section id="programacao" class="program-section">
        <div class="content-container">
          <div class="section-heading">
            <div>
              <span class="eyebrow">Programação</span>
            </div>
          </div>

          <AgendaSemana :eventos="events" @select="openModal" />
          <div class="calendario-shell">
            <CalendarioAnualVue :eventos="events" />
          </div>
        </div>
      </section>

      <section id="adicionar-evento" class="adicionar-evento">
        <div class="adicionarEvento-container">
          <img :src="vetorImg" alt="Ilustração da seção de solicitação de evento" class="adicionarEvento-vetor" />

          <div class="adicionarEvento-texto">
            <span class="eyebrow">Solicitações</span>
            <h2>Quer solicitar algum evento ao nosso calendário?</h2>
            <p>
              Use o fluxo oficial do IFRN para enviar novos pedidos de publicação e manter a agenda
              institucional sempre atualizada.
            </p>
            <a href="https://suap.ifrn.edu.br/" target="_blank" class="btn-solicitar-evento">
              <span class="btn-texto">Solicitar evento</span>
              <span class="btn-icon">
                <img :src="arrowImg" alt="Ir para o SUAP" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section id="inscricoes" class="inscricoes">
        <div class="inscricoes-content">
          <div class="section-heading section-heading--light">
            <div>
              <span class="eyebrow">Inscrições</span>
              <h2>Inscrições abertas</h2>
            </div>
          </div>

          <div v-if="loading" class="feedback-card feedback-card--dark">Carregando inscrições...</div>
          <div v-else>
            <Carrossel :eventos="registrationEvents" :component="CardInscricao" @select="openModal" />
          </div>
        </div>
      </section>
    </main>

    <Footer />

    <Teleport to="body">
      <Transition name="fade">
        <Modal v-if="showModal && selectedEvent" :eventoSelecionado="selectedEvent" @close="closeModal" />
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.24s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: grid;
  gap: 28px;
  padding-top: 18px;
}

.content-container {
  width: min(1440px, calc(100% - 48px));
  margin: 0 auto;
}

.section-heading h2,
.adicionarEvento-texto h2 {
  color: #0b513f;
  font-size: clamp(1.7rem, 4vw, 2.8rem);
  line-height: 1.02;
}

.section-heading p,
.adicionarEvento-texto p {
  color: rgba(10, 70, 53, 0.74);
  font-size: 1.02rem;
  line-height: 1.65;
}

.eyebrow {
  color: #07753e;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  margin-bottom: 18px;
}

.section-heading h2 {
  font-size: 2rem;
}

.section-heading--light h2,
.section-heading--light p,
.section-heading--light .eyebrow {
  color: #ffffff;
}

.destaques-default-section,
.program-section,
.adicionar-evento {
  padding: 0;
}

.feedback-card {
  border-radius: 24px;
  padding: 22px;
  background: #ffffff;
  color: #0b513f;
  box-shadow: 0 18px 35px rgba(2, 64, 46, 0.08);
}

.feedback-card--error {
  color: #7a2b2b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.feedback-card--dark {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
}

.retry-button {
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  background: #07753e;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.adicionarEvento-container {
  width: min(1440px, calc(100% - 48px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.1fr);
  gap: 36px;
  align-items: center;
  background: #ffffff;
  border-radius: 36px;
  padding: 28px 36px;
  box-shadow: 0 22px 40px rgba(2, 64, 46, 0.08);
}

.adicionarEvento-vetor {
  width: 100%;
  max-width: 420px;
  justify-self: center;
}

.adicionarEvento-texto {
  display: grid;
  gap: 14px;
}

.adicionarEvento-texto h2 {
  font-size: 2.4rem;
}

.btn-solicitar-evento {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-self: start;
  margin-top: 6px;
  padding: 12px 20px;
  border-radius: 999px;
  text-decoration: none;
  background: #39b87f;
  color: #ffffff;
  font-weight: 700;
}

.btn-icon img {
  width: 28px;
  height: 28px;
}

.inscricoes {
  width: min(1440px, calc(100% - 48px));
  margin: 0 auto 48px;
  border-top-left-radius: 6rem;
  border-bottom-right-radius: 6rem;
  min-height: 390px;
  background-image: url('@/assets/inscricoesSection.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.inscricoes-content {
  padding: 36px;
}

.calendario-shell {
  position: relative;
  overflow: hidden;
  margin-top: 18px;
  border-radius: 34px;
  background:
    radial-gradient(circle at 12% 18%, rgba(138, 238, 195, 0.42), transparent 24%),
    radial-gradient(circle at 88% 22%, rgba(7, 117, 62, 0.16), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(244, 252, 248, 0.98));
  box-shadow: 0 24px 42px rgba(2, 64, 46, 0.08);
}

.calendario-shell::before,
.calendario-shell::after {
  content: '';
  position: absolute;
  left: -10%;
  right: -10%;
  height: 90px;
  background-repeat: repeat-x;
  opacity: 0.55;
  pointer-events: none;
}

.calendario-shell::before {
  top: 0;
  background:
    radial-gradient(circle at 20px 48px, transparent 34px, rgba(138, 238, 195, 0.28) 35px, rgba(138, 238, 195, 0.28) 40px, transparent 41px)
      0 0 / 120px 90px repeat-x;
}

.calendario-shell::after {
  bottom: -8px;
  transform: rotate(180deg);
  background:
    radial-gradient(circle at 20px 48px, transparent 34px, rgba(7, 117, 62, 0.1) 35px, rgba(7, 117, 62, 0.1) 40px, transparent 41px)
      0 0 / 120px 90px repeat-x;
}

@media (min-width: 1025px) {
  .content-container {
    width: min(1320px, calc(100% - 80px));
  }
}

@media (max-width: 1024px) {
  .adicionarEvento-container {
    grid-template-columns: 1fr;
  }

  .section-heading {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .content-container,
  .adicionarEvento-container,
  .inscricoes {
    width: min(100%, calc(100% - 24px));
  }

  .section-heading h2,
  .adicionarEvento-texto h2 {
    font-size: 1.55rem;
  }

  .adicionarEvento-container,
  .inscricoes-content {
    padding: 20px;
  }

  .inscricoes {
    border-top-left-radius: 28px;
    border-bottom-right-radius: 28px;
  }

  .main-content {
    gap: 22px;
    padding-top: 14px;
  }

  .section-heading {
    gap: 12px;
  }

  .adicionarEvento-texto p {
    display: none;
  }
}
</style>
