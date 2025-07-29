import { Account, Client, Databases } from "react-native-appwrite";

export const client = new Client()
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "")
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "")
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? "react-native");


  export const account = new Account(client);
  export const database = new Databases(client);
  export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;
  export const HABITS_COLLECTION_ID = process.env.EXPO_PUBLIC_HABITS_COLLECTION_ID!;
  export const COMPLETIONS_COLLECTION_ID = process.env.EXPO_PUBLIC_HABITS_COMPLETIONS!;
  export const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
export interface RealTimeResponse {
  events: string[],
  payload: any
}