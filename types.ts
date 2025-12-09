export enum AppView {
  DASHBOARD = 'DASHBOARD',
  VIDEO_GENERATOR = 'VIDEO_GENERATOR',
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  SCRIPT_WRITER = 'SCRIPT_WRITER'
}

export interface GeneratedMedia {
  url: string;
  type: 'image' | 'video';
  prompt: string;
  timestamp: number;
}

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9', // Best for YouTube
  PORTRAIT = '9:16'   // Best for Shorts
}

export enum ImageResolution {
  R_1K = '1K',
  R_2K = '2K',
  R_4K = '4K'
}

// Global type augmentation
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
