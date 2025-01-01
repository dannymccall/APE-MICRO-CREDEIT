import "server-only";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { IUser } from "../types";
import CryptoJS from "crypto-js"
const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET;

const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: any | undefined) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}




const _secretKey: string | any = process.env.NEXT_PUBLIC_ASYNC_KEY// Use a strong, unique key

export const encryptData = (data: unknown): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), _secretKey).toString();
};

export const decryptData = <T>(cipherText: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, _secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as T;
  } catch (error) {
    console.error("Decryption failed", error);
    return null;
  }
};
