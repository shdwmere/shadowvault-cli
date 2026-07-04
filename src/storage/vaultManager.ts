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
  // 1. Verifica se o arquivo de fato existe no caminho configurado
  try {
    await fs.access(VAULT_PATH);
  } catch {
    // Se falhar o acesso, o arquivo não existe. Lança o erro com o caminho real para debugar.
    throw new Error(`VAULT_FILE_NOT_FOUND: O arquivo não existe em: ${VAULT_PATH}`);
  }

  // 2. Tenta ler e parsear o conteúdo do arquivo
  try {
    const rawData = await fs.readFile(VAULT_PATH, 'utf8');
    
    // Se o arquivo estiver criado mas sem nenhum texto dentro
    if (!rawData.trim()) {
      throw new Error("VAULT_EMPTY: O arquivo existe mas está vazio.");
    }

    // Retorna o objeto JSON plano pronto para a descriptografia
    return JSON.parse(rawData);
  } catch (error: any) {
    // Se for o nosso próprio erro de arquivo não encontrado, só repassa ele
    if (error.message.startsWith('VAULT_FILE_NOT_FOUND')) {
      throw error;
    }
    // Caso seja erro de JSON inválido ou permissão de leitura
    throw new Error(`Erro ao ler/parsear o arquivo do cofre: ${error.message}`);
  }
}
