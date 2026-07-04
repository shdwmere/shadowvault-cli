// src/storage/vaultManager.ts
import fs from 'fs/promises';
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
export async function loadVault(): Promise<EncryptedVault> {
	if (!(await vaultExists())) {
		throw new Error('Vault not found. initialize shadowvault first.');
	}
	const rawData = await fs.readFile(VAULT_PATH, 'utf8');
	return JSON.parse(rawData) as EncryptedVault;
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