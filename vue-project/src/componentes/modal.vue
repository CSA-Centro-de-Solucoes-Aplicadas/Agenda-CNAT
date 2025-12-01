<script setup lang="ts">
import { ref } from "vue"
import modalBanner from "@/assets/modalbanner.png"

// Evento vindo do banco (exemplo)
const evento = {
  local: "Biblioteca Central",
  nome: "Cinebiblio",
  descricao:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus condimentum metus mi, sed tempus sapien elementum vitae.",
  datas: [
    { dia: "23/06", horario: "11h às 16h" },
    { dia: "24/06", horario: "10h às 14h" },
    { dia: "25/06", horario: "08h às 12h" },
    { dia: "26/06", horario: "13h às 17h" },
    { dia: "27/06", horario: "09h às 13h" }
  ],
  contatos: ["email1@ifrn.edu.br", "email2@ifrn.edu.br", "email3@ifrn.edu.br"],
  palestras: ["Palestra"],
  link: "https://ifrn.edu.br/evento",
  imagem: modalBanner
}

const modo = ref("info")

function next() {
  modo.value = modo.value === "info" ? "imagem" : "info"
}

function prev() {
  modo.value = modo.value === "info" ? "imagem" : "info"
}
</script>

<template>
  <div class="story-wrapper">

    <div class="progress-wrapper">
      <div class="bar" :class="{ active: modo === 'info' }"></div>
      <div class="bar" :class="{ active: modo === 'imagem' }"></div>
    </div>

    <div class="story-card">

      <!-- LADO ESQUERDO -->
      <div class="left">

        <div class="title-row">
          <button class="arrow-btn" @click="prev">‹</button>
          <h1>{{ evento.nome }}</h1>
          <button class="arrow-btn" @click="next">›</button>
        </div>

        <!-- PRIMEIRO CARD (INFO) -->
        <template v-if="modo === 'info'">

          <div class="local">{{ evento.local }}</div>

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

          <!-- FOOTER -->
          <div class="footer">
            <a :href="evento.link" class="mais-info" target="_blank">mais informações</a>

            <div class="categoria-box">
              <strong v-for="(p, i) in evento.palestras" :key="i">{{ p }}</strong>
            </div>
          </div>

        </template>

        <!-- SEGUNDO CARD (LISTA VERDE) -->
        <template v-else>
          <div class="datas-list">
            <h2>Dias & Horários</h2>

            <ul>
              <li v-for="(d, i) in evento.datas" :key="i">
                <strong>{{ d.dia }}</strong>
                <span>{{ d.horario }}</span>
              </li>
            </ul>
          </div>
        </template>

      </div>

      <!-- LADO DIREITO COM IMAGEM FULL -->
      <div class="right">
        <img :src="evento.imagem" class="side-image" />
      </div>

    </div>
  </div>
</template>

<style scoped>
.progress-wrapper {
  position: absolute;
  top: 30px;
  left: 110px;
  display: flex;
  gap: 8px;
}

.bar {
  width: 100px;
  height: 6px;
  background: #e5e5e5;
  border-radius: 999px;
}

.bar.active {
  background: linear-gradient(90deg, #5ea4ef, #6fe0a5);
}

.story-card {
  width: 800px;
  height: 500px;
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
}

.left {
  width: 55%;
  padding: 50px 45px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
h2{
  margin-bottom: 10px;
  font-size: 20px;
}
.right {
  width: 45%;
  position: relative;
  overflow: hidden;
}

.side-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* LISTA VERDE COM SCROLL */
.datas-list {
  background: #dff5e4;
  padding: 16px;
  border-radius: 16px;
  height: 100%;
  overflow-y: auto;
  max-height: 330px;
  padding-right: 10px;
}

/* scrollbar */
.datas-list::-webkit-scrollbar {
  width: 8px;
}
.datas-list::-webkit-scrollbar-track {
  background: #c1e7cc;
  border-radius: 8px;
}
.datas-list::-webkit-scrollbar-thumb {
  background: #7cc98f;
  border-radius: 8px;
}
.datas-list::-webkit-scrollbar-thumb:hover {
  background: #63b578;
}

.datas-list h2 {
  margin-bottom: 12px;
  color: #0a4f18;
}

.datas-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.datas-list li {
  background: #ffffff;
  padding: 12px 14px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #0f5d1a;
  font-weight: 500;
}

/* FOOTER */
.footer {
  margin-top: 10px;
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
  margin-left: 100px;
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
