/// <reference types="vite/client" />

declare module 'path' {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
}

declare const __dirname: string;