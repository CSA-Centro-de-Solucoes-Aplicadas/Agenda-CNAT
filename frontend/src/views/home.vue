<script setup lang="ts">
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
import arrowImg from '@/assets/arrow-right.png'
import { RouterLink } from 'vue-router'

const eventos = [
  {
    titulo: 'Evento alusivo ao dia do professor de geografia',
    local: 'Miniauditório Central',
    categoria: 'Palestras',
    datas: [
      { data: '20/06', hora: '14:00', descricao: 'Abertura das inscrições' },
      { data: '20/07', hora: '12:00', descricao: 'Inicio do evento' },
      { data: '24/06', hora: '23:59', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Esporte',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
]
</script>

<template>
  <div class="page">
    <header class="main-header">
      <div class="header-container">
        <RouterLink to="/" class="header-logo-container">
          <img :src="logoImg" alt="Logo Eventos CNAT" class="header-logo" />
        </RouterLink>
        <ul>
          <li><a href="#programacao">Programação</a></li>
          <li><a href="#adicionar-evento">Adicionar Evento</a></li>
          <li><a href="#inscricoes">Inscrições Abertas</a></li>
        </ul>
      </div>
    </header>

    <main class="main-content">
      <BarradePesquisa class="barra-pesquisa" />
      <section class="destaques-default-section">
        <div class="content-container">
          <Carrossel :itens="eventos" :component="CardDestaque" />
        </div>
      </section>

      <section id="programacao" class="calendarioSemanal default-section">
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
            <h3>Quer adicionar algum evento ao nosso calendário?</h3>
            <p>Clique no botão abaixo para cadastrar seu evento no SUAP</p>
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
          <Carrossel :itens="eventos" :component="CardInscricao" />
        
        </div>
      </section>
    </main>
    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <a href=""><img :src="logoFooter" alt="Eventos CNAT" class="footer-logo" /></a>
          <a href="https://portal.ifrn.edu.br/"
            ><img :src="logoIfrn" alt="Logo do IFRN" class="logo-if"
          /></a>
        </div>

        <div class="footer-right">
          <div class="social">
            <a href="https://www.instagram.com/ifrncnat"
              ><img :src="instagramImg" alt="Logotipo do Instagram"
            /></a>
            <a href="https://x.com/IFRNCNAT"><img :src="XImg" alt="Logotipo do X" /></a>
            <a href="https://www.youtube.com/ifrncnat?themeRefresh=1"
              ><img :src="youtubeImg" alt="Logotipo do YouTube"
            /></a>
          </div>

          <p>seac.cnat@ifrn.edu.br</p>

          <address>
            Av. Sen. Salgado Filho, 1559 – Tirol, Natal – RN <br /><strong>CEP:</strong> 59015-000
          </address>
        </div>
      </div>
      <div class="copy">
        <a href="https://csa.cnat.ifrn.edu.br/"
          ><p>© 2025 - Centro de Soluções Aplicadas. Todos os direitos reservados.</p></a
        >
      </div>
    </footer>
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
  padding: 0 100px;
  width: 100%;
}

.content-container h3 {
  margin-bottom: 40px;
}

.destaques-default-section {
  width: 100%;
  padding: 2rem 0;
  overflow-x: hidden;
}

.inscricoes {
  max-width: 100%;
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

.main-header {
  width: 100%;
  background-color: #8aeec3;
  box-shadow: 2px 1px 5px #b8b8b8;
  position: relative;
  overflow: hidden;
  min-height: 110px;
  max-height: 110px;
}

.main-content {
  flex: 1;
  width: 100%;
  overflow-x: hidden;
}

.header-logo-container {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1440px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 0 100px;
  z-index: 10;
}

.header-logo {
  width: 15%;
  max-width: 180px;
  height: auto;
  cursor: pointer;
}

.header-container {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20px 100px 20px 100px;
  position: relative;
}

header ul {
  list-style: none;
  display: flex;
  gap: 2.5rem;
  padding: 1.5rem;
  z-index: 20;
  margin-left: auto;
}

header li a {
  text-decoration: none;
  font-size: 1.2rem;
  color: #07753e;
  font-weight: 500;
  transition: 0.2s;
}

header li a:hover {
  color: #044632;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
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
  padding: 30px 100px 50px;
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

footer {
  background-color: #02402e;
  color: #ffffff;
  font-size: 14px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.footer-content {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 40px 100px 30px;
  gap: 20px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 10px 4px;
}

footer-left a,
p {
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
}

.footer-logo {
  width: 220px;
}

.logo-if {
  width: 220px;
}

.footer-right {
  display: flex;
  flex-direction: column;
  text-align: right;
  gap: 6px;
}

.footer-right p {
  margin: 10px 4px;
  font-size: 20px;
}

.social {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.social img {
  width: 38px;
  cursor: pointer;
  transition: 0.2s;
}

.social img:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

.copy {
  text-align: center;
  font-size: 12px;
  padding: 15px 20px;
  background-color: #012118;
  width: 100%;
  opacity: 0.85;
  text-decoration: none;
}
.copy a {
  color: inherit;
  text-decoration: none;
}
.copy p {
  color: #ffffff;
}

main section:last-child {
  margin-bottom: 6rem;
}
.barra-pesquisa {
  display: flex;
  margin: auto;
  width: 100%;
  display: block;
}
@media (max-width: 1024px) {
  .header-logo {
    top: 20px;
    left: 30px;
    max-width: 130px;
  }

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

@media (max-width: 900px) {
  .header-container {
    flex-direction: column;
    align-items: center;
    padding-top: 80px;
    gap: 20px;
  }

  header ul {
    display: none;
  }

  header li a {
    font-size: 1rem;
  }

  .header-logo-container {
    justify-content: left;
  }

  .header-logo {
    width: 120px;
  }

  .adicionar-evento::before,
  .adicionarEvento-container::after {
    display: none;
  }

  .adicionarEvento-container {
    flex-direction: column;
    height: auto;
    padding: 30px 20px;
    border-radius: 30px;
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
  header ul {
    display: none;
  }

  .main-header {
    min-height: 60px;
    max-height: 60px;
  }

  .header-container {
    padding: 0;
  }

  .header-logo-container {
    position: static;
    transform: none;
    justify-content: left;
    padding: 10px 8px;
  }

  .header-logo {
    top: 50px;
    left: 10px;
    width: 50%;
    max-width: 80px;
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

  .adicionar-evento {
    border-top-right-radius: 30px;
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

  .footer-content {
    flex-direction: column;
    align-items: left;
    text-align: left;
  }
  .footer-right {
    text-align: left;
    align-items: left;
    margin-top: 20px;
  }
  .social {
    justify-content: left;
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
    border-radius: 30px;
    text-align: center;
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