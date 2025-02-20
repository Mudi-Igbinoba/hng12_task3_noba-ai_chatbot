export {};

declare global {
  interface Window {
    ai?: {
      languageDetector?: {
        capabilities: () => Promise<{
          capabilities: string;
          available: string;
        }>;
        create: (options?: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          monitor?: (m: any) => void; // Add monitor as an optional property
          ready?: boolean;
          sourceLanguage?: string;
          targetLanguage?: string;
        }) => Promise<{
          monitor?: string;
          ready?: boolean;
          sourceLanguage?: string;
          targetLanguage?: string;
          detect: (
            text: string
          ) => Promise<{ detectedLanguage: string; confidence: number }[]>;
        }>;
      };
      translator?: {
        capabilities: () => Promise<{
          capabilities: string;
          available: string;
        }>;
        create: (options?: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          monitor?: (m: any) => void; // Add monitor as an optional property
          ready?: boolean;
          sourceLanguage?: string;
          targetLanguage?: string;
        }) => Promise<{
          monitor?: string;
          ready?: boolean;
          sourceLanguage?: string;
          targetLanguage?: string;
          translate: (text: string) => Promise<string>;
        }>;
      };
      summarizer?: {
        capabilities: () => Promise<{
          capabilities: string;
          available: string;
        }>;
        create: (options?: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          monitor?: (m: any) => void;
          ready?: boolean;
          sourceLanguage?: string;
          targetLanguage?: string;
          sharedContext?: string;
          type?: string;
          format?: string;
          length?: string;
        }) => Promise<{
          monitor?: string;
          ready?: boolean;
          sourceLanguage?: string;
          targetLanguage?: string;
          sharedContext?: string;
          type?: string;
          format?: string;
          length?: string;
          summarize: (text: string, { context: string }) => Promise<string>;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          addEventListener: (event: string, callback: (e: any) => void) => void;
        }>;
      };
    };
  }
}
