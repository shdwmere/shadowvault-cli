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
export function loadVault(): any {
  // 1. Se o arquivo NÃO existe, não faz sentido tentar descriptografar!
  if (!fs.existsSync(vaultPath)) {
    // Aqui você escolhe: ou lança um erro explícito...
    throw new Error(`VAULT_FILE_NOT_FOUND: O arquivo não existe em ${vaultPath}`);
    
    // ...ou se o seu index.ts espera que um cofre novo seja criado, retorne null:
    // return null;
  }

  try {
    const rawData = fs.readFileSync(vaultPath, 'utf8');
    
    // 2. Se o arquivo existir mas estiver totalmente vazio (0 bytes)
    if (!rawData.trim()) {
      throw new Error("VAULT_EMPTY: O arquivo existe mas está vazio.");
    }

    return JSON.parse(rawData);
  } catch (error: any) {
    // Evita engolir o erro estrutural do arquivo
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
