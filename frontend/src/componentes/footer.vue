<script setup>
import logoImg from '@/assets/logo.svg'
import logoFooter from '@/assets/logoFooter.png'
import logoIfrn from '@/assets/ifrn.png'
import XImg from '@/assets/x.png'
import instagramImg from '@/assets/instagram.png'
import youtubeImg from '@/assets/youtube.png'
</script>
<template>
  <footer>
      <div class="footer-content">
        <div class="footer-left">
          <img :src="logoFooter" alt="Eventos CNAT" class="footer-logo" />
          <img :src="logoIfrn" alt="Logo do IFRN" class="logo-if" />
        </div>

        <div class="footer-right">
          <div class="social">
            <a href="https://www.instagram.com/ifrncnat">
              <img :src="instagramImg" alt="Instagram" />
            </a>
            <a href="https://x.com/IFRNCNAT">
              <img :src="XImg" alt="X" />
            </a>
            <a href="https://www.youtube.com/ifrncnat">
              <img :src="youtubeImg" alt="YouTube" />
            </a>
          </div>

          <p>seac.cnat@ifrn.edu.br</p>

          <address>
            Av. Sen. Salgado Filho, 1559 – Tirol, Natal – RN<br />
            <strong>CEP:</strong> 59015-000
          </address>
        </div>
      </div>

      <div class="copy">
        <a href="https://csa.cnat.ifrn.edu.br/">
          © 2025 - Centro de Soluções Aplicadas. Todos os direitos reservados.
        </a>
      </div>
    </footer>
</template>
<style scoped>
footer {
  background-color: #02402e;
  color: #ffffff;
  font-size: 14px;
  margin-top: 6rem;
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
  padding: 40px;
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
</style>
