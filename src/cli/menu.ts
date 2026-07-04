// src/cli/menu.ts
import { select, input } from '@inquirer/prompts';
import { THEME } from '../config/constants.js';

interface VaultItem {
  id: string;
  name: string;
  email?: string;
  username?: string;
  password?: string;
  updatedAt?: string;
}

/**
 * Renderiza um banner estilizado no estilo Fallout (Verde Fósforo)
 */
export function printFalloutBanner(title: string) {
  console.clear();
  console.log(`${THEME.primary}%s${THEME.reset}`, '==================================================');
  console.log(`${THEME.primary}%s${THEME.reset}`, `  SHADOWVAULT OS v1.0.0 - ${title.toUpperCase()}`);
  console.log(`${THEME.primary}%s${THEME.reset}`, '==================================================\n');
}

/**
 * Loop principal do Dashboard pós-login
 */
export async function mainMenu(items: VaultItem[]) {
  while (true) {
    printFalloutBanner('ROBCO INDUSTRIES CORES');
    console.log(`${THEME.primary}%s${THEME.reset}`, `[ CORES LOADED: ${items.length} ]\n`);

    // Menu de opções principal
    const action = await select({
      message: 'SELECT COMMAND >',
      choices: [
        { name: '1. LIST ALL CREDENTIALS', value: 'list' },
        { name: '2. SEARCH CREDENTIAL', value: 'search' },
        { name: '3. TERMINAL LOGOUT', value: 'logout' }
      ]
    });

    if (action === 'logout') {
      console.log(`${THEME.primary}%s${THEME.reset}`, '\n[ SHUTTING DOWN SHADOWVAULT CORES ]...');
      process.exit(0);
    }

    if (action === 'list') {
      await handleListCredentials(items);
    }

    if (action === 'search') {
      await handleSearch(items);
    }
  }
}

/**
 * Sub-tela: Listagem e visualização de uma senha específica
 */
async function handleListCredentials(items: VaultItem[]) {
  printFalloutBanner('CREDENTIAL REGISTRY');

  if (items.length === 0) {
    console.log(`${THEME.alert}%s${THEME.reset}`, 'NO ENTRY FOUND IN THIS COFFER.');
    await input({ message: 'PRESS ENTER TO RETURN...' });
    return;
  }

  // Transforma o array de senhas em opções selecionáveis
  const choices = items.map(item => ({
    name: item.name,
    value: item.id
  }));

  choices.push({ name: '<< RETURN TO MAIN MENU', value: 'back' });

  const selectedId = await select({
    message: 'CHOOSE ENTRY TO DECRYPT >',
    choices: choices
  });

  if (selectedId === 'back') return;

  const chosenItem = items.find(i => i.id === selectedId);
  if (chosenItem) {
    printFalloutBanner(`ENTRY: ${chosenItem.name}`);
    console.log(`${THEME.primary}%s${THEME.reset}`, `IDENTIFIER: ${chosenItem.id}`);
    console.log(`${THEME.primary}%s${THEME.reset}`, `EMAIL:      ${chosenItem.email || 'N/A'}`);
    console.log(`${THEME.primary}%s${THEME.reset}`, `USERNAME:   ${chosenItem.username || 'N/A'}`);
    console.log(`${THEME.accent}%s${THEME.reset}`, `PASSWORD:   ${chosenItem.password || 'NO PASSWORD'}`); // Destaque em Ciano/Verde claro
    console.log(`${THEME.primary}%s${THEME.reset}`, `UPDATED AT: ${chosenItem.updatedAt || 'N/A'}`);
    console.log(`${THEME.primary}%s${THEME.reset}`, '\n==================================================');
    
    await input({ message: 'PRESS ENTER TO RETURN TO LIST...' });
    // Chama recursivamente para continuar na lista
    await handleListCredentials(items);
  }
}

/**
 * Sub-tela: Busca simples por nome
 */
async function handleSearch(items: VaultItem[]) {
  printFalloutBanner('SEARCH ENGINE');
  
  const query = await input({ message: 'ENTER SEARCH QUERY >' });
  const filtered = items.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  await handleListCredentials(filtered);
}