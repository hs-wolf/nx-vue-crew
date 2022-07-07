export interface Schema {
  name: string;
  directory?: string;
  tags?: string;
  libraries?: string;
  serverPort: number;
  automatizations: boolean;
  onDemandSvgIcons: boolean;
  translationSupport: boolean;
  cssFramework: string;
  cssExtension: string;
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
