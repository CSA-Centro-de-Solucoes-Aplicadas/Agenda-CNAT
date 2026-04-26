# Especificação de Implantação (Deployment Spec)

Este documento contém todas as informações técnicas, credenciais e variáveis de ambiente necessárias para a equipe de DevOps realizar o deploy da aplicação **Agenda-CNAT**.

## 1. Dados Gerais da Aplicação
*   **Nome do Projeto**: Agenda-CNAT
*   **Repositório Git**: `<INSERIR_URL_DO_GIT_AQUI>` (ex: `https://github.com/seu-usuario/agenda-cnat.git`)
*   **Branch de Deploy**: `main`
*   **Tecnologias**:
    *   **Backend**: Node.js v18+ (Payload CMS 3.0)
    *   **Frontend**: Vue.js (Static/Nginx)
    *   **Banco de Dados**: PostgreSQL 16+

## 2. Acesso ao Repositório (Git)
Para que o CapRover possa baixar o código, é necessário fornecer uma credencial de acesso.
*   **Tipo de Acesso**: *(Escolha uma opção: Token HTTPS (Recomendado) ou Chave SSH)*

### Opção A: Personal Access Token (HTTPS)
*   **Usuário**: `<SEU_USUARIO_GIT>`
*   **Token (Senha)**: `<COLE_SEU_TOKEN_DO_GITHUB_AQUI>`
    *   *Nota: No GitHub, gere este token em Settings > Developer Settings > Personal Access Tokens.*

### Opção B: SSH Deploy Key
Caso o deploy seja via SSH, copie a chave pública gerada abaixo para as "Deploy Keys" do repositório no GitHub.
*   **Chave Privada (Para o CapRover)**: `<INSERIR_CHAVE_PRIVADA_AQUI>`

## 3. Banco de Dados (PostgreSQL)
Abaixo estão as credenciais **definidas para este ambiente de produção**. A equipe de infraestrutura deve configurar o banco com estes dados ou fornecer a string de conexão equivalente.

### Definições de Acesso
| Parâmetro | Valor Definido |
| :--- | :--- |
| **Engine** | PostgreSQL 16 |
| **Database Name** | `agenda_db` |
| **User** | `agenda_user` |
| **Password** | `k9Xm2PqL5vJw8Zn4R7bT3yH6cF1gS0dM` |
| **Porta Interna** | `5432` |

### String de Conexão (DATABASE_URL)
Com base nos dados acima, a string de conexão para a variável de ambiente será:
```text
postgres://agenda_user:k9Xm2PqL5vJw8Zn4R7bT3yH6cF1gS0dM@srv-captain--agenda-db:5432/agenda_db
```
*(Se estiver usando o One-Click App do CapRover com nome `agenda-db`, o host geralmente é `srv-captain--agenda-db`)*

## 4. Variáveis de Ambiente (Environment Variables)
Copie e cole este bloco de configuração para cada aplicação no CapRover.

### 4.1. BACKEND (Payload CMS)
Configuração do serviço da API.

```env
# Configurações Obrigatórias
DATABASE_URL=postgres://agenda_user:k9Xm2PqL5vJw8Zn4R7bT3yH6cF1gS0dM@srv-captain--agenda-db:5432/agenda_db
PAYLOAD_SECRET=e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1

# Configurações de Rede (Opcionais)
PORT=3000
NODE_ENV=production

# Configurações de Email (Preencher se houver envio de email)
# SMTP_HOST=smtp.exemplo.com
# SMTP_USER=usuario
# SMTP_PASS=senha
# SMTP_PORT=587
```

### 4.2. FRONTEND (Vue.js)
Configuração da interface do usuário.

**ATENÇÃO**: As variáveis abaixo devem ser inseridas **ANTES** de executar o build (Deploy), pois são incorporadas estaticamente ao código.

```env
# URL da API de Produção (Sem a barra no final)
VITE_API_URL=https://api.agenda.seudominio.com.br
```

## 5. Domínios e SSL
*   **Frontend (Acesso Público)**: `agenda.seudominio.com.br` (Ativar HTTPS/Force HTTPS)
*   **Backend (API)**: `api.agenda.seudominio.com.br` (Ativar HTTPS/Force HTTPS)

## 6. Arquivos de Infraestrutura (Captain Definition)
Os arquivos necessários para o CapRover reconhecer a estrutura do projeto já estão no repositório:
*   Backend: `/payload/captain-definition`
*   Frontend: `/frontend/captain-definition`

---
*Documento gerado automaticamente para solicitação de deploy.*
