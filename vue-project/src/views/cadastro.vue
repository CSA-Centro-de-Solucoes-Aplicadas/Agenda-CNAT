<script setup lang="ts">
import logoImg from '@/assets/logo.svg'
import logoFooter from '@/assets/logoFooter.png'
import logoIfrn from '@/assets/ifrn.png'
import XImg from '@/assets/x.png'
import instagramImg from '@/assets/instagram.png'
import youtubeImg from '@/assets/youtube.png'
//http://localhost:5173/cadastro
</script>

<template>
  <div class="page">
    <header class="main-header">
      <div class="header-logo-container">
        <img :src="logoImg" alt="Logo Eventos CNAT" class="header-logo" />
      </div>
     <div class="header-inner">
      <ul>
        <li><a href="">Calendário</a></li>
        <li><a href="">Adicionar Evento</a></li>
        <li><a href="">Inscrições Abertas</a></li>
      </ul>
     </div>
    </header>

    <main class="main-content">
          <!-- Section 1 -->
          <section class="form-section">
            <h2>1. Informações do Evento</h2>

            <div class="form-group">
              <label>Nome do Evento*</label>
              <input type="text" />
            </div>

            <div class="form-group">
              <label>Imagem de divulgação*</label>
              <textarea></textarea>
            </div>

            <div class="form-group">
              <label>Categorias</label>
            
            </div>

            <div class="form-group">
              <label>Descrição</label>
              <textarea></textarea>
            </div>
          </section>

          <!-- Section 2 -->
          <section class="form-section">
            <h2>2. Data e Horário do evento</h2>

            <div class="date-time-grid">
              <div class="form-group">
                <label>Data de Início</label>
                <input type="date" />
              </div>
              <div class="form-group">
                <label>Hora de Início</label>
                <input type="time" />
              </div>
              <div class="form-group">
                <label>Data de Término</label>
                <input type="date" />
              </div>
              <div class="form-group">
                <label>Hora de Término</label>
                <input type="time" />
              </div>
            </div>

            <h2>2. Data e Horário da abertura de inscrições</h2>
            <div class="date-time-grid">
              <div class="form-group">
                <label>Data de Início</label>
                <input type="date" />
              </div>
              <div class="form-group">
                <label>Hora de Início</label>
                <input type="time" />
              </div>
              <div class="form-group">
                <label>Data de Término</label>
                <input type="date" />
              </div>
              <div class="form-group">
                <label>Hora de Término</label>
                <input type="time" />
              </div>
            </div>
          </section>

          <section class="form-section">
            <h2>3. Informações dos organizadores</h2>

            <div class="form-group">
              <label>Email</label>
              <input type="email" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" />
            </div>
          </section>

          <div class="submit-container">
            <button class="submit-btn">Confirmar</button>
          </div>
       
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
.page {
  background: #f4f4f4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}


.main-header {
  width: 100%;
  background-color: #8aeec3;
  box-shadow: 2px 1px 5px #b8b8b8;
  position: relative;
  margin-bottom: 100px;
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
.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 20px;
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

/* MAIN */
.main-content {
  max-width: 1440px;
  width: 1440px;
  margin: 40px auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.form-section {
  width: 100%;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0002;
}

.form-section h2 {
  margin-bottom: 20px;
  color: #11392d;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}
.form-group input,
.form-group textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.tags span {
  background: #e8f6ef;
  padding: 6px 12px;
  border-radius: 8px;
  margin-right: 8px;
  font-size: 0.9rem;
}
.date-time-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

/* BUTTON */
.submit-container {
  display: flex;
  justify-content: flex-end;
}
.submit-btn {
  background: #0a8f5a;
  color: white;
  padding: 12px 30px;
  border-radius: 10px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
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
</style>
