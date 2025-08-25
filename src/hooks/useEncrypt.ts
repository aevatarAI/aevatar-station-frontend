async function generateKeyPair() {
    const data = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );
  return data
  }
  
function encryptMessage(publicKey: any, message: string) {
    let enc = new TextEncoder();
    const encoded = enc.encode(message);
    return window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      encoded,
    );
  }
  
function decryptMessage(privateKey: any, ciphertext: any) {
    return window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      ciphertext,
    );
  }

export const useEncrypt = async (message: string) => {
    const keyPair = await generateKeyPair();
    const { publicKey, privateKey } = keyPair;
    const ciphertext = await encryptMessage(publicKey, message);

    return { privateKey, ciphertext }
}

export const useDecrypt = async (privateKey: any, ciphertext: any) => {
    let dec = new TextDecoder();
    const arrayBuffer = await decryptMessage(privateKey, ciphertext)
    const decrypted = dec.decode(arrayBuffer)

    return { decrypted }
}