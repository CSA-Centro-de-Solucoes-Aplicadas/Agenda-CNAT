<script setup lang="ts">
import logoImg from '@/assets/logo.svg'
</script>

<template>
  <header class="admin-header">
    <div class="admin-header__content">
      <RouterLink to="/" class="brand">
        <img :src="logoImg" alt="Logo Eventos CNAT" class="brand__logo" />
      </RouterLink>

      <nav class="admin-nav">
        <RouterLink to="/cadastro" active-class="is-active">Cadastrar evento</RouterLink>
        <RouterLink to="/eventos" active-class="is-active">Gerenciar eventos</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.admin-header {
  background: linear-gradient(180deg, rgba(138, 238, 195, 0.94), rgba(138, 238, 195, 0.78));
  box-shadow: 0 14px 28px rgba(2, 64, 46, 0.08);
}

.admin-header__content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 18px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.brand__logo {
  width: 176px;
  height: auto;
}

.admin-nav {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.admin-nav a {
  text-decoration: none;
  color: #07753e;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
}

.admin-nav a.is-active {
  background: #07753e;
  color: #ffffff;
}

@media (max-width: 900px) {
  .admin-header__content {
    padding: 14px 18px;
    flex-direction: column;
    align-items: flex-start;
  }

  .brand__logo {
    width: 132px;
  }
}
</style>
