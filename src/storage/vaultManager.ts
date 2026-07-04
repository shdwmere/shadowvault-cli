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
 * Lê o arquivo json criptografado no disco
 */

