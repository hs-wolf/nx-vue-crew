import { join, relative } from 'path';
import { existsSync } from 'fs';
import { Observable } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';
import {
  InlineConfig,
  ProxyOptions,
  createServer,
  mergeConfig,
  ViteDevServer,
  searchForWorkspaceRoot,
} from 'vite';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import { DevExecutorSchema } from './schema';
import { replaceFiles } from '../../plugins';

export default async function* runExecutor(
  options: DevExecutorSchema,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);
  let proxyConfig: Record<string, string | ProxyOptions>;
  const proxyConfigPath = options.proxyConfig
    ? join(context.root, options.proxyConfig)
    : join(projectRoot, 'proxy.conf.json');
  if (existsSync(proxyConfigPath)) {
    logger.info(`Found proxy configuration at ${proxyConfigPath}`);
    proxyConfig = require(proxyConfigPath);
  }
  const serverConfig: InlineConfig = mergeConfig(
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
      server: {
        proxy: proxyConfig,
        fs: {
          allow: [
            searchForWorkspaceRoot(joinPathFragments(projectRoot)),
            joinPathFragments(context.root, 'node_modules/vite'),
          ],
        },
      },
    }
  );
  const server = await createServer(serverConfig);
  return yield* eachValueFrom(runViteDevServer(server));
}

export function runViteDevServer(
  server: ViteDevServer
): Observable<{ success: boolean; baseUrl: string }> {
  return new Observable((subscriber) => {
    let devServer: ViteDevServer;
    try {
      server
        .listen()
        .then((dev) => {
          devServer = dev;
          const protocol = devServer.config.server.https ? 'https' : 'http';
          const hostname = resolveHostname(devServer.config.server.host);
          const serverBase =
            hostname.host === '127.0.0.1' ? hostname.name : hostname.host;
          const baseUrl = `${protocol}://${serverBase}:${devServer.config.server.port}`;
          server.printUrls();
          subscriber.next({ success: true, baseUrl });
        })
        .catch((err) => {
          subscriber.error(err);
        });
      return async () => await devServer.close();
    } catch (err) {
      subscriber.error(err);
      throw new Error('Could not start dev server.');
    }
  });
}

export function resolveHostname(optionsHost: string | boolean | undefined) {
  let host: string | undefined;
  if (
    optionsHost === undefined ||
    optionsHost === false ||
    optionsHost === 'localhost'
  ) {
    host = '127.0.0.1';
  } else if (optionsHost === true) {
    host = undefined;
  } else {
    host = optionsHost;
  }
  const name =
    (optionsHost !== '127.0.0.1' && host === '127.0.0.1') ||
    host === '0.0.0.0' ||
    host === '::' ||
    host === undefined
      ? 'localhost'
      : host;
  return { host, name };
}
