<script setup lang="ts">
import logoImg from '@/assets/logo.svg'
import logoFooter from '@/assets/logoFooter.png'
import logoIfrn from '@/assets/ifrn.png'
import XImg from '@/assets/x.png'
import instagramImg from '@/assets/instagram.png'
import youtubeImg from '@/assets/youtube.png'
</script>

<template>
  <div>
    <header class="main-header">
      <div class="header-logo-container">
        <img :src="logoImg" alt="Logo Eventos CNAT" class="header-logo" />
      </div>
      <ul>
        <li><a href="">Calendário</a></li>
        <li><a href="">Adicionar Evento</a></li>
        <li><a href="">Inscrições Abertas</a></li>
      </ul>
    </header>
    <main>
      <table></table>
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

<style scoped></style>
