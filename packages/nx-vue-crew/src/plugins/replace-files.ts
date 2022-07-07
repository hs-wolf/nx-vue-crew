import { logger } from '@nrwl/devkit';

export function replaceFiles(
  replacements: Array<{ file: string; with: string }>
) {
  if (!replacements?.length) {
    return null;
  }
  return {
    name: 'rollup-plugin-replace-files',
    enforce: 'pre',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async resolveId(source: any, importer: any) {
      const resolved = await this.resolve(source, importer, { skipSelf: true });
      if (resolved?.id) {
        const foundReplace = replacements.find(
          (replacement) => replacement.file === resolved.id
        );
        if (foundReplace) {
          logger.info(
            `replace "${foundReplace.file}" with "${foundReplace.with}"`
          );
          try {
            return {
              id: foundReplace.with,
            };
          } catch (err) {
            logger.error(err);
            return null;
          }
        }
      }
      return null;
    },
  };
}
