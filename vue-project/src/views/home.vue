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
        <div class="header-logo-container">
          <img :src="logoImg" alt="Logo Eventos CNAT" class="header-logo" />
        </div>
        <ul>
          <li><a href="">Programação</a></li>
          <li><a href="">Adicionar Evento</a></li>
          <li><a href="">Inscrições Abertas</a></li>
        </ul>
      </div>
    </header>

    <main class="main-content">
      <BarradePesquisa class="barra-pesquisa" />
      <section class="destaques-default-section">
        <div class="content-container">
          <h3>Eventos do CNAT</h3>
          <Carrossel :itens="eventos" :component="CardDestaque" />
        </div>
      </section>

      <section class="calendarioSemanal default-section">
        <div class="content-container">
          <h3>Programação</h3>
          <AgendaSemana></AgendaSemana>
          <CalendarioAnualVue></CalendarioAnualVue>
        </div>
      </section>

      <section class="adicionar-evento">
        <div class="adicionarEvento-container">
          <img :src="vetorImg" alt="Vetor" class="adicionarEvento-vetor" />
          <div class="adicionarEvento-texto">
            <h3>Quer adicionar algum evento ao nosso calendário?</h3>
            <p>Clique no botão abaixo para cadastrar seu evento no SUAP</p>
          </div>
        </div>
      </section>

      <section class="inscricoes">
        <div class="inscricoes-content">
          <h3>Inscrições abertas</h3>
          <Carrossel :itens="eventos" :component="CardInscricao" />
        </div>
      </section>
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <img :src="logoFooter" alt="Eventos CNAT" class="footer-logo" />
          <img :src="logoIfrn" alt="Logo do IFRN" class="logo-if" />
        </div>

        <div class="footer-right">
          <div class="social">
            <img :src="instagramImg" alt="Logotipo do Instagram" />
            <img :src="XImg" alt="Logotipo do X" />
            <img :src="youtubeImg" alt="Logotipo do YouTube" />
          </div>
          <p>cnat@ifrn.com</p>
          <address>
            Av. Sen. Salgado Filho, 1559 – Tirol, Natal – RN <br /><strong>CEP:</strong> 59015-000
          </address>
        </div>
      </div>
      <div class="copy">
        <p>© 2025 - Centro de Soluções Aplicadas. Todos os direitos reservados.</p>
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
  padding: 0 20px;
}

.content-container h3 {
  margin-bottom: 80px;
}
.main-header {
  width: 100%;
  background-color: #8aeec3;
  box-shadow: 2px 1px 5px #b8b8b8;
  position: relative;
  overflow: hidden;
  min-height: 120px;
  max-height: 250px;
}

.main-content {
  flex: 1;
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
  padding: 0 20px;
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
  padding: 20px;
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

.inscricoes-content {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  padding: 30px 20px;
}

.inscricoes-content h3 {
  color: white;
  font-size: 32px;
  padding: 30px;
  margin: 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
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
  padding: 40px 20px 30px;
  gap: 20px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 10px 4px;
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
}

/* Space before footer */
main section:last-child {
  margin-bottom: 6rem;
}

@media (max-width: 1024px) {
  .header-logo {
    top: 20px;
    left: 30px;
    max-width: 130px;
  }

  .adicionar-evento {
    border-top-right-radius: 80px;
    align-items: center;
    min-height: auto;
  }

  .adicionarEvento-vetor {
    width: 70%;
    max-width: 400px;
    margin: 0 auto;
    order: 1;
  }

  .adicionarEvento-container {
    position: static;
    transform: none;
    padding: 0;
    justify-content: center;
    margin-top: 20px;
    order: 2;
  }

  .adicionarEvento-texto {
    max-width: 520px;
    text-align: center;
    align-items: center;
  }

  .adicionarEvento-texto h3 {
    font-size: 22px;
  }
}

/* Centralizar barra de pesquisa */
.barra-pesquisa {
  display: flex;
  margin: auto;
  width: 100%;
  display: block;
}

@media (max-width: 600px) {
  .header-logo {
    top: 10px;
    left: 10px;
    width: 25%;
    max-width: 40px;
  }

  .default-section {
    padding: 25px 0;
  }
  h3 {
    font-size: 24px;
  }

  .adicionar-evento {
    border-top-right-radius: 30px;
    padding: 10px 10px;
  }
  .adicionar-vetor {
    width: 50%;
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
}
</style>
