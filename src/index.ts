#!/usr/bin/env node
// src/index.ts
import { password } from '@inquirer/prompts';
import { loadVault } from './storage/vaultManager.js';
import { decrypt } from './crypto/cypher.js';
import { mainMenu, printBanner } from './cli/menu.js';
import { THEME } from './config/constants.js';

// Helper para delay visual
const bootSequence = (message: string) => new Promise<void>((resolve) => {
  process.stdout.write(`${THEME.primary}⚙️ ${message.toUpperCase()}... ${THEME.reset}`);
  setTimeout(() => {
    process.stdout.write(`${THEME.primary}[ SUCCESS ]\n\x1b[0m${THEME.reset}`);
    resolve();
  }, 700);
});

async function startApp() {
  printBanner('SECURITY GATEWAY');

  await bootSequence('initializing shadowvault hardware');
  await bootSequence('checking kernel integrity');

  let encryptedVault;

  try {
    encryptedVault = await loadVault();
  } catch (error: any) {
    console.log(`${THEME.alert} ❌ STORAGE ERROR: ${error.message}${THEME.reset}`);
    setTimeout(() => process.exit(1), 3000);
    return
  }

  console.log(`${THEME.primary}\n==================================================\n${THEME.reset}`);

  try {
    const masterPassword = await password({
      message: 'ENTER MASTER KEY TO DECRYPT VAULT >',
      mask: '*'
    });

    if (!masterPassword) {
      console.log(`${THEME.alert} \nOperation aborted.${THEME.reset}`)
    }

    console.log(`${THEME.primary} \n[ ACCESSING LOCAL COFFER... ]${THEME.reset}`);

    const decryptedData = await decrypt(encryptedVault, masterPassword);

    // --- DEPOIS DA SENHA (MFA/INTEGRIDADE): VERIFICAÇÃO VISUAL ---
    console.log(''); // Linha em branco
    await bootSequence('authenticating master key credentials');
    await bootSequence('verifying aes-256-gcm authentication tag');
    await bootSequence('allocating secure memory buffers');
    await bootSequence('decrypted payload memory sync');

    // to JSON
    const vaultItems = JSON.parse(decryptedData);
    
    // dramatic delay
    setTimeout(async () => {
      await mainMenu(vaultItems);
    }, 800)
  } catch (error: any) {
    console.log(`${THEME.alert} \n❌ FATAL ERROR: ACCESS DENIED. INVALID MASTER KEY.${THEME.reset}`);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }

}

startApp().catch(err => {
  console.error("System crash:", err);
  process.exit(1);
});