// src/config/constants.ts
import path from 'path'
import os from 'os'

export const VAULT_CONFIG = {
  // Centraliza o caminho do arquivo (se um dia quiser mudar para .config, muda aqui)
  directory: path.join(os.homedir(), '.shadowvault'),
  filename: 'vault.json',
  
  // Parâmetros de criptografia centralizados
  algorithm: 'aes-256-gcm',
  iterations: 100000,
  keyLength: 32,
  ivLength: 12,
  saltLength: 16
};

export const THEME = {
  primary: '\x1b[32m', // Verde Fallout
  alert: '\x1b[31m',   // Vermelho Erro
  accent: '\x1b[36m',  // Ciano Detalhes
  reset: '\x1b[0m'
};