export interface ViteVueSpaGeneratorSchema {
  name: string;
  directory?: string;
  tags?: string;
  libraries?: string;
  serverPort: number;
  automatizations: boolean;
  onDemandSvgIcons: boolean;
  translationSupport: boolean;
  cssFramework: CSSFrameworks;
  cssExtension: CSSExtensions;
}

export enum CSSFrameworks {
  tailwindcss = 'tailwindcss',
  windicss = 'windicss',
  none = 'none',
}

export enum CSSExtensions {
  sass = 'sass',
  none = 'none',
}
