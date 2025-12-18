<script setup lang="ts">
import { ref } from 'vue'
import modalBanner from '@/assets/modalbanner.png'

const evento = {
  local: 'Biblioteca Central',
  nome: 'Cinebiblio',
  descricao:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus condimentum metus mi, sed tempus sapien elementum vitae.',
  datas: { inicio: '23/06', fim: '27/06' },
  contatos: ['email1@ifrn.edu.br', 'email2@ifrn.edu.br', 'email3@ifrn.edu.br'],
  palestras: ['Palestra'],
  link: 'https://ifrn.edu.br/evento',
  imagem: modalBanner,
}

const modo = ref('info')

function next() {
  modo.value = modo.value === 'info' ? 'imagem' : 'info'
}

function prev() {
  modo.value = modo.value === 'info' ? 'imagem' : 'info'
}
</script>

<template>
  <div class="story-wrapper">
    <div class="progress-wrapper">
      <div class="bar active"></div>
    </div>

    <div class="story-card">
      <div class="left">
        <h1>{{ evento.nome }}</h1>
        <div class="local">{{ evento.local }}</div>

        <div class="datas-list">
          <span>{{ evento.datas.inicio }} até {{ evento.datas.fim }}</span>
        </div>

        <p class="descricao">{{ evento.descricao }}</p>

        <div class="contatos-box">
          <h2>Contatos</h2>
          <div class="contatos-grid">
            <div class="contato-item" v-for="(c, i) in evento.contatos" :key="i">
              <img src="@/assets/contato.png" class="user-icon" />
              <span>{{ c }}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <a :href="evento.link" class="mais-info" target="_blank">mais informações</a>
          <div class="categoria-box">
            <strong v-for="(p, i) in evento.palestras" :key="i">{{ p }}</strong>
          </div>
        </div>
      </div>

      <div class="right">
        <img :src="evento.imagem" class="side-image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-wrapper {
  position: absolute;
  top: 20px;
  left: 115px;
  display: flex;
  gap: 8px;
}

.bar {
  width: 150px;
  height: 7px;
  background: #e5e5e5;
  border-radius: 999px;
}

.bar.active {
  background: linear-gradient(90deg, #5ea4ef, #6fe0a5);
}

.story-card {
  width: 650px;
  height: 500px;
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
}

.left {
  flex: 1;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
h1 {
  font-size: 36px;
  margin-top: 5px;
  margin-left: 70px;
  margin-bottom: 5px;
}
h2 {
  margin-bottom: 10px;
  font-size: 20px;
}
.right {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.side-image {
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.datas-list {
  background: #dff5e4;
  padding: 16px;
  border-radius: 16px;
  height: auto;
}
.datas-list span {
  font-size: 14px;
  margin-left: 20px;
  color: #559e67;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.mais-info {
  font-size: 14px;
  color: #4b4b4b;
  text-decoration: underline;
  cursor: pointer;
}

.categoria-box {
  display: flex;
  justify-content: flex-end;
  width: 50%;
}

.categoria-box strong {
  font-size: 15px;
  margin-left: auto;
}

/* OUTROS */
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.arrow-btn:hover {
  transform: scale(1.35);
}

.local {
  font-size: 18px;
  color: #333;
  margin-left: 90px;
}

.descricao {
  color: #6e6e6e;
  font-size: 14px;
  width: 90%;
  margin-left: 15px;
}

.contatos-box {
  background: #e4f3ea;
  padding: 18px;
  border-radius: 16px;
  width: 100%;
}

.contatos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 12px;
}

.contato-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  padding: 10px;
  border-radius: 10px;
}

.user-icon {
  width: 20px;
  opacity: 0.7;
}
</style>
