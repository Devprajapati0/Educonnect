import * as openpgp from 'openpgp';
import { openDB } from "idb";

const DB_NAME = import.meta.env.VITE_DB_NAME;
const STORE_NAME = import.meta.env.VITE_STORE_NAME;
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveKey = async (keyName, keyValue) => {
  const db = await initDB();
  await db.put(STORE_NAME, keyValue, keyName);
};

export const getKey = async (keyName) => {
  const db = await initDB();
  return db.get(STORE_NAME, keyName);
};

export const generateKeyPair = async () => {
  try {
    // Step 1: Generate the key pair using openpgp
    const { privateKey, publicKey } = await openpgp.generateKey({
      userIDs: [{ name: 'Test User', email: 'test@example.com' }], // Optional user info
      curve: 'ed25519', // You can choose between RSA, ECC (ed25519, secp256k1), etc.
      passphrase: '', // Optional: If you want a passphrase for the private key
    });

    console.log("Generated Public Key:", publicKey);
    console.log("Generated Private Key:", privateKey);

    // Save public and private keys or return them
    await saveKey("privateKey", privateKey);
    return publicKey;

  } catch (error) {
    console.error("Error generating key pair:", error);
    throw new Error('Failed to generate keys');
  }
};
