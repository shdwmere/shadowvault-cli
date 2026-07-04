// src/storage/vaultManager.ts
import * as fs from 'fs';
import path from 'path';
import os from 'os';
import { encrypt, decrypt, EncryptedVault } from '../crypto/cypher.js';
import { VAULT_CONFIG } from '../config/constants.js';

// ~/.shadowvault/vault.json
const VAULT_DIR = VAULT_CONFIG.directory;
const VAULT_PATH = path.join(VAULT_CONFIG.directory, VAULT_CONFIG.filename);

/**
 * Garante que o diretorio do shadowvault exista na maquina
 */
async function ensureDirectoryExists() {
	try {
		await fs.mkdir(VAULT_DIR, { recursive: true });
	} catch (error) {
		throw new Error(`Error creating vault directory: ${error}`);
	}
}

/**
 * Verifica se o arquivo vault.json ja existe
 */
export async function vaultExists(): Promise<boolean> {
	try {
		await fs.access(VAULT_PATH);
		return true;
	} catch {
		return false;
	}
}

/**
 * Salva os dados criptografados no arquivo local.
 */
export async function saveVault(encryptedData: EncryptedVault): Promise<void> {
	await ensureDirectoryExists();
	await fs.writeFile(VAULT_PATH, JSON.stringify(encryptedData, null, 2), 'utf8');
}

/**
 * Lê o arquivo criptografado do disco.
 */
export async function loadVault(): Promise<any> {
  try {
    // 1. Usando fs.access (que funciona com Promises) para checar se o arquivo existe
    await fs.access(VAULT_PATH);
  } catch {
    // Se o access estourar erro, significa que o arquivo não existe
    throw new Error(`VAULT_FILE_NOT_FOUND: O arquivo não existe em ${VAULT_PATH}`);
  }

  try {
    // 2. Lendo o arquivo de forma assíncrona com o seu import original
    const rawData = await fs.readFile(VAULT_PATH, 'utf8');
    
    if (!rawData.trim()) {
      throw new Error("VAULT_EMPTY: O arquivo existe mas está vazio.");
    }

    return JSON.parse(rawData);
  } catch (error: any) {
    if (error.message.startsWith('VAULT_FILE_NOT_FOUND')) {
      throw error;
    }
    throw new Error(`Erro ao ler o arquivo do cofre: ${error.message}`);
  }
}


/**
 * Função utilitária para fazer o "Seed" / Importação do seu arquivo antigo.
 * Você passa o caminho do arquivo aberto e a senha master que deseja definir.
 */
export async function importUnencryptedJson(sourcePath: string, masterPassword: string): Promise<void> {
	try {
		const rawData = await fs.readFile(sourcePath, 'utf8');
		
		JSON.parse(rawData); // verifica se é JSON válido

		const encrypted = await encrypt(rawData, masterPassword);

		await saveVault(encrypted); // salva no caminho definitivo (~/.shadowvault/vault.json)

		console.log(`Vault successfully generated at ${VAULT_PATH}`)
	} catch (error) {
		throw new Error(`Failed to import: ${error}`)
	}
}
