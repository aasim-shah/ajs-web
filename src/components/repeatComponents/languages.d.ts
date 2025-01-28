declare module 'languages' {
    export interface Language {
      name: string;
      nativeName: string;
      code: string;
    }
  
    export function getAllLanguages(): { [key: string]: Language };
  }
  