<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import logoImg from '@/assets/logo.svg'
const isAdmin = ref(true)
</script>

<template>
  <header class="main-header">
    <RouterLink to="/" class="header-logo-container">
      <img :src="logoImg" alt="Logo Eventos CNAT" class="header-logo" />
    </RouterLink>

    <div v-if="isAdmin" class="header-inner">
      <ul>
        <li>
          <RouterLink to="/cadastro"> Cadastrar eventos </RouterLink>
        </li>
        <li>
          <RouterLink to="/eventos"> Editar eventos </RouterLink>
        </li>
      </ul>
    </div>

    <!-- HEADER PÚBLICO -->
    <div v-else class="header-inner">
      <ul>
        <li><RouterLink to="/#programacao">Programação</RouterLink></li>
        <li><RouterLink to="/#adicionar-evento">Adicionar Evento</RouterLink></li>
        <li><RouterLink to="/#inscricoes">Inscrições Abertas</RouterLink></li>
      </ul>
    </div>
  </header>
</template>
<style scoped>
.main-header {
  width: 100%;
  background-color: #8aeec3;
  box-shadow: 2px 1px 5px #b8b8b8;
  position: relative;

  overflow: hidden;
  min-height: 120px;
  max-height: 250px;
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

@media (max-width: 1024px) {
  .header-logo {
    top: 20px;
    left: 30px;
    max-width: 130px;
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
}
</style>
