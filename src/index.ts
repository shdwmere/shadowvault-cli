#!/usr/bin/env node
// src/index.ts
import dotenv from 'dotenv';
import { password } from '@inquirer/prompts';
import { loadVault } from './storage/vaultManager.js';
import { decrypt } from './crypto/cypher.js';
import { mainMenu, printFalloutBanner } from './cli/menu.js';

dotenv.config();

async function startApp() {
  printFalloutBanner('SECURITY GATEWAY');

  try {
    // 1. Solicita a Master Password escondendo os caracteres digitados
    const masterPassword = await password({
      message: 'ENTER MASTER KEY TO DECRYPT VAULT >',
      mask: '*' // Coloca asterisco enquanto digita
    });

    if (!masterPassword) {
      console.log('\x1b[31m%s\x1b[0m', '\nOperation aborted.');
      process.exit(0);
    }

    console.log('\x1b[32m%s\x1b[0m', '\n[ ACCESSING LOCAL COFFER... ]');
    
    // 2. Carrega o arquivo da Home
    const encryptedVault = await loadVault();

    // 3. Tenta descriptografar (GCM valida a integridade aqui)
    const decryptedData = await decrypt(encryptedVault, masterPassword);

    // 4. Se chegou aqui, a senha está 100% correta. Joga pro Menu!
    const vaultItems = JSON.parse(decryptedData);
    
    await mainMenu(vaultItems);

  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', '\n❌ FATAL ERROR: ACCESS DENIED. INVALID MASTER KEY.');
    // Pequeno delay para o usuário ler o erro antes de encerrar
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
}

startApp().catch(err => {
  console.error("System crash:", err);
  process.exit(1);
});