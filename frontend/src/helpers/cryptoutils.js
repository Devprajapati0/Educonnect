import * as openpgp from 'openpgp';

export const encryptWithPublicKey = async (message, publicKey) => {
  try {
    // Convert the public key to OpenPGP key object
    // console.log('Public Key:', publicKey,message);
    const publicKeyObj = await openpgp.readKey({ armoredKey: publicKey });
    // console.log('Public Key Object:', publicKeyObj);
    // Encrypt the message
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }), // Create message
      encryptionKeys: publicKeyObj, // Public key for encryption
    });


    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt message');
  }
};

export const encryptAndSign = async (message, publicKeyArmored, privateKeyArmored, passphrase = '') => {
  try {
    // Read public and private keys
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });

    if (privateKey.isDecrypted?.() === false) {
      await privateKey.decrypt(passphrase);
    }

    // Create the encrypted and signed message
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      encryptionKeys: publicKey,
      signingKeys: privateKey,
    });

    return encrypted;
  } catch (error) {
    console.error('Encrypt & Sign failed:', error);
    throw new Error('Failed to encrypt and sign message');
  }
};


export const signWithPrivateKey = async (encryptedMessage, armoredPrivateKey, passphrase = '') => {
    try {
      // Read the private key
      const privateKeyObj = await openpgp.readPrivateKey({ armoredKey: armoredPrivateKey });
      console.log('Private Key Object:', privateKeyObj);
  
      // Decrypt the private key only if it is encrypted
      if (privateKeyObj.isDecrypted?.() === false) {
        console.log("Private Key is encrypted. Decrypting...");
        await privateKeyObj.decrypt(passphrase);
      } else {
        console.log("Private Key is not encrypted or already decrypted.");
      }
  
      // Sign the message
      const signedMessage = await openpgp.sign({
        message: await openpgp.createMessage({ text: encryptedMessage }),
        signingKeys: privateKeyObj,
      });
  
      return signedMessage;
    } catch (error) {
      console.error('Signing failed:', error);
      throw new Error('Failed to sign message');
    }
  };
  
export const decryptWithPrivateKey = async (encryptedMessage, privateKey, passphrase) => {
  try {
    // Convert the private key to OpenPGP key object
    const privateKeyObj = await openpgp.readKey({ armoredKey: privateKey });

    // Decrypt the private key if it's encrypted (using the passphrase)
    if (privateKeyObj.isEncrypted()) {
      await privateKeyObj.decrypt(passphrase);
    }

    // Decrypt the message
    const decrypted = await openpgp.decrypt({
      message: await openpgp.readMessage({ armoredMessage: encryptedMessage }), // Read encrypted message
      decryptionKeys: privateKeyObj, // Private key for decryption
    });

    return decrypted.data; // The decrypted message text
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt message');
  }
};