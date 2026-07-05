// src/storage/vaultManager.ts
import fs from 'fs/promises';
import path from 'path';
import { VAULT_CONFIG } from '../config/constants.js';

// Monta o caminho absoluto baseado nas suas configurações globais
const VAULT_PATH = path.join(VAULT_CONFIG.directory, VAULT_CONFIG.filename);

/**
 * Carrega e faz o parse do arquivo vault.json.
 * Lança erros explícitos caso o arquivo não exista ou esteja corrompido.
 */
export async function loadVault(): Promise<any> {
  // verificacao estrita de acesso ao arquivo
  try {
    await fs.access(VAULT_PATH, fs.constants.R_OK);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`VAULT NOT FOUND! Move the folder .shadowvault and file at: ${VAULT_PATH}`);
    } else if (error.code === 'EACCES') {
      throw new Error(`SYSTEM ACCESS DENIED trying to access ${VAULT_PATH}`)
    } else {
      throw new Error(`Couldn't access the path: ${VAULT_PATH} (ERROR: ${error.code})`);
    }
  }

  // le e parsea
  try {
    const rawData = await fs.readFile(VAULT_PATH, 'utf8');

    if (!rawData.trim()) {
      throw new Error("The file does exist but its empty (VAULT_EMPTY).");
    }

    return JSON.parse(rawData);
  } catch (error: any) {
    throw new Error(`Critical error in JSON structure: ${error.message}`);
  }
}
