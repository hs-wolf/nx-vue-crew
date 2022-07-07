export interface Schema {
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

export interface NormalizedSchema extends Schema {
  projectName: string;
  projectRoot: string;
  projectScope: string;
  projectDirectory: string;
  parsedTags: string[];
  parsedLibraries: { name: string; path: string }[];
  cssFileExtension: string;
}
