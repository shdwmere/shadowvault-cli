// src/crypto/cypher.tsimport crypto from 'crypto';
import { VAULT_CONFIG } from '../config/constants.js';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // padrao recomendado para GCM
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

// interface para estrutura do arquivo que será salvo no disco
export interface EncryptedVault {
	salt: string;
	iv: string;
	authTag: string;
	ciphertext: string;
}

/**
 * Deriva uma chave criptográfica forte de 256 bits a partir da senha mestra usando PBKDF2.
 */
const deriveKey = (password: string, salt: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password, 
      salt, 
      VAULT_CONFIG.iterations,
      VAULT_CONFIG.keyLength,
      'sha256', 
      (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      }
    );
  });
};

/**
 * Criptografa um texto puro (dados do vault) usando a senha master.
 */
export async function encrypt(plainText: string, passwordSecret: string): Promise<EncryptedVault> {
	const salt = crypto.randomBytes(VAULT_CONFIG.saltLength);
	const iv = crypto.randomBytes(VAULT_CONFIG.ivLength);

	const key = await deriveKey(passwordSecret, salt);
	const cipher = crypto.createCipheriv(VAULT_CONFIG.algorithm, key, iv);

	let ciphertext = cipher.update(plainText, 'utf8', 'hex');
	ciphertext += cipher.final('hex');

	const authTag = cipher.getAuthTag().toString('hex');

	return {
		salt: salt.toString('hex'),
		iv: iv.toString('hex'),
		authTag: authTag,
		ciphertext: ciphertext
	};
}

/**
 * Descriptografa o conteudo do vault usando a senha master.
 * Se a senha estiver incorreta ou o arquivo for modificado, ela estoura um erro automaticamente.
 */
export async function decrypt(encryptedVault: EncryptedVault, passwordSecret: string): Promise<string> {
	const salt = Buffer.from(encryptedVault.salt, 'hex');
	const iv = Buffer.from(encryptedVault.iv, 'hex');
	const authTag = Buffer.from(encryptedVault.authTag, 'hex');

	const key = await deriveKey(passwordSecret, salt);
	const decipher = crypto.createCipheriv(VAULT_CONFIG.algorithm, key, iv);

	decipher.setAuthTag(authTag)

	let plainText = decipher.update(encryptedVault.ciphertext, 'hex', 'utf8');
	plainText += decipher.final('utf8');

	return plainText;
}