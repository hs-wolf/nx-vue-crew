export interface DevExecutorSchema {
  outputPath: string;
  baseHref?: string;
  configFile?: string;
  frameworkConfigFile?: string;
  fileReplacements?: { file: string; with: string }[];
  proxyConfig?: string;
}
