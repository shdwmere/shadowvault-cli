#!/usr/bin/env node
// src/index.ts
import { password } from '@inquirer/prompts';
import { loadVault } from './storage/vaultManager.js';
import { decrypt } from './crypto/cypher.js';
import { mainMenu, printBanner } from './cli/menu.js';
import { THEME } from './config/constants.js';

async function startApp() {
  printBanner('SECURITY GATEWAY');

  let encryptedVault;

  try {
    encryptedVault = await loadVault();
  } catch (error: any) {
    console.log(`${THEME.alert}${THEME.reset} ❌ STORAGE ERROR: ${error.message}`);
    setTimeout(() => process.exit(1), 3000);
    return
  }

  try {
    const masterPassword = await password({
      message: 'ENTER MASTER KEY TO DECRYPT VAULT >',
      mask: '*'
    });

    if (!masterPassword) {
      console.log(`${THEME.alert}${THEME.reset} \nOperation aborted.`)
    }

    console.log(`${THEME.primary}${THEME.reset} \n[ ACCESSING LOCAL COFFER... ]`);

    const decryptedData = await decrypt(encryptedVault, masterPassword);

    const vaultItems = JSON.parse(decryptedData);
    await mainMenu(vaultItems);
  } catch (error: any) {
    console.log(`${THEME.alert}${THEME.reset} \n❌ FATAL ERROR: ACCESS DENIED. INVALID MASTER KEY.`);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }

}

startApp().catch(err => {
  console.error("System crash:", err);
  process.exit(1);
});