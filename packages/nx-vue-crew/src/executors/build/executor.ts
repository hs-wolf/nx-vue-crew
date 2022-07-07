import { relative } from 'path';
import { build, InlineConfig, mergeConfig } from 'vite';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import { BuildExecutorSchema } from './schema';
import { replaceFiles } from '../../plugins';

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);
  const buildConfig: InlineConfig = mergeConfig(
    {},
    {
      root: projectRoot,
      base: options.baseHref ?? '/',
      build: {
        outDir: relative(projectRoot, options.outputPath),
        emptyOutDir: true,
        reportCompressedSize: true,
        cssCodeSplit: true,
        rollupOptions: {
          plugins: [replaceFiles(options.fileReplacements)],
        },
      },
      configFile: joinPathFragments(`${context.root}/${options.configFile}`),
    },
    true
  );
  try {
    await build(buildConfig);
    logger.info('Bundle complete.');
  } catch (error) {
    logger.error(`Error during bundle: ${error}`);
    return {
      success: false,
    };
  }
  return {
    success: true,
  };
}
