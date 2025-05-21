// utils/keysDB.js
import { openDB } from "idb";

const DB_NAME = "SecureChat"
const STORE_NAME = "keys"

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
