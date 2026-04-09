# CHAMADO TECNICO - AJUSTE DE DEPLOY NO CAPROVER (Agenda-CNAT)

## Resumo do problema
A aplicacao em producao no dominio `https://agenda.cnat.ifrn.edu.br` abre com pagina em branco.

## Evidencias coletadas em producao
1. `GET /` retorna `200` com HTML do frontend (Vite).
2. O HTML referencia os assets:
	- `/assets/index-YRdnx2rQ.js`
	- `/assets/index-BlZz8GlZ.css`
3. `GET` nesses assets retorna `404`.
4. O corpo do `404` indica resposta do app backend (Next/Payload), nao do Nginx do frontend.
5. `GET /api/eventos?limit=1` retorna `500` com `{"errors":[{"message":"Something went wrong."}]}`.

## Diagnostico tecnico
Existem dois problemas simultaneos no ambiente:

1. **Roteamento/proxy incorreto no CapRover**
	- O frontend entrega o `index.html`, mas os caminhos estaticos do frontend (`/assets/*`) estao sendo encaminhados ao backend.
	- Como consequencia, o navegador nao carrega JS/CSS e a tela fica branca.

2. **Backend com falha interna (500)**
	- A rota de API `/api/eventos` responde 500.
	- Causa provavel: `DATABASE_URL` usando host indevido para ambiente containerizado (ex.: `127.0.0.1`).
	- Em CapRover, o host deve ser o nome interno do servico PostgreSQL (ex.: `srv-captain--agenda-db`).

## Solicitacao de ajuste para a equipe de infraestrutura
### 1) Regras de roteamento
Configurar o dominio `agenda.cnat.ifrn.edu.br` com as seguintes regras:

1. `/api/*` -> app backend (Payload, porta 3000)
2. `/` e demais caminhos -> app frontend (Nginx, porta 80)
3. Garantir que `favicon.ico`, `/assets/*`, e demais arquivos estaticos sejam sempre atendidos pelo frontend

### 2) Configuracao dos apps no CapRover
1. Frontend:
	- Captain Definition Relative Path: `./frontend/captain-definition`
	- Container HTTP Port: `80`
2. Backend:
	- Captain Definition Relative Path: `./payload/captain-definition`
	- Container HTTP Port: `3000`

### 3) Variaveis de ambiente
1. Frontend (build-time):
	- `VITE_PAYLOAD_URL=https://agenda.cnat.ifrn.edu.br`
	- `VITE_PAYLOAD_API_PATH=/api`
2. Backend (runtime):
	- `PAYLOAD_SECRET=<valor_definido_no_ambiente>`
	- `DATABASE_URL=postgres://<user>:<senha>@<host_interno_postgres>:5432/<database>`

> Observacao importante: nao usar `127.0.0.1` como host do banco dentro do container do backend.

## Criterios de aceite (validacao pos-ajuste)
1. `GET https://agenda.cnat.ifrn.edu.br/assets/index-*.js` retorna `200`.
2. `GET https://agenda.cnat.ifrn.edu.br/assets/index-*.css` retorna `200`.
3. `GET https://agenda.cnat.ifrn.edu.br/api/eventos?limit=1` nao retorna `500`.
4. A pagina inicial carrega normalmente sem tela branca.

## Informacoes do repositorio
- Repositorio: `https://github.com/CSA-Centro-de-Solucoes-Aplicadas/Agenda-CNAT.git`
- Branch: `main`

