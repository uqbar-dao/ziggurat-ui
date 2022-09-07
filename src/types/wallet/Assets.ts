import { Token } from "./Token";

export interface Assets {
  [key: string]: {
    [key: string]: Token
  }
}