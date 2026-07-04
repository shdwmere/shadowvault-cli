# 🔐 ShadowVault CLI

Gerenciador portátil e seguro de senhas por linha de comando (CLI) construído com Node.js e TypeScript. Projetado com foco em leveza e segurança para funcionar perfeitamente em ambientes desktop e mobile (Termux no Android).

## 🚀 Tecnologias

* **Node.js** (v18+)
* **TypeScript** & **tsx**
* **@inquirer/prompts** (Interface de terminal interativa)

## 🛡️ Segurança

* **Criptografia Autenticada:** Utiliza o algoritmo **AES-256-GCM** nativo do Node.js, garantindo sigilo absoluto e proteção contra qualquer modificação maliciosa ou corrupção do arquivo.
* **Derivação de Chave Forte:** A chave criptográfica é gerada a partir da sua Master Password usando **PBKDF2** com 100.000 iterações e Salt pseudoaleatório.
* **Armazenamento Seguro:** Não há persistência de senhas em texto puro ou chaves no disco. O cofre reside criptografado em `~/.shadowvault/vault.json` e os dados são descriptografados apenas em memória RAM após a validação da Master Key.

## 📁 Estrutura do Projeto

```text
shadowvault-cli/
├── src/
│   ├── config/
│   │   └── constants.ts      # Configurações do algoritmo, caminhos e tema
│   ├── crypto/
│   │   └── cypher.ts         # Métodos de criptografia e PBKDF2
│   ├── storage/
│   │   └── vaultManager.ts   # Manipulação e persistência do arquivo JSON
│   ├── cli/
│   │   └── menu.ts           # Fluxo de navegação e telas de prompts
│   └── index.ts              # Ponto de entrada do sistema
├── package.json
└── tsconfig.json

```

## 🛠️ Instalação e Execução

### Instalar dependências

```bash
npm install

```

### Modo de Desenvolvimento

Executa o ambiente de testes de forma interativa:

```bash
npm run dev

```

### Compilar e Rodar em Produção

Compila o TypeScript para código nativo otimizado:

```bash
npm run build
npm start

```

## ⌨️ Comandos Globais (Opcional)

Se deseja executar o comando `shadowvault` de qualquer diretório da sua máquina ou Termux, realize o link global do pacote:

```bash
npm link

```