import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { join } from 'path';
import { ViteVueSpaGeneratorSchema } from './schema';

interface NormalizedSchema extends ViteVueSpaGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectScope: string;
  projectDirectory: string;
  parsedTags: string[];
  parsedLibraries: { name: string; path: string }[];
  cssFileExtension: string;
}

function normalizeOptions(
  tree: Tree,
  options: ViteVueSpaGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const projectScope = getWorkspaceLayout(tree).npmScope;
  const parsedTags = options.tags
    ? options.tags.split(/[\s,]+/).map((s) => s.trim())
    : [];
  const parsedLibraries = options.libraries
    ? options.libraries.split(/[\s,]+/).map((s) => {
        return {
          name: s.trim(),
          path: `${getWorkspaceLayout(tree).libsDir}/${s.trim()}`,
        };
      })
    : [];
  const setCssFileExtension = () => {
    switch (options.cssExtension) {
      case 'sass':
        return 'scss';
      default:
        return 'css';
    }
  };
  const cssFileExtension = setCssFileExtension();

  return {
    ...options,
    projectName,
    projectRoot,
    projectScope,
    projectDirectory,
    parsedTags,
    parsedLibraries,
    cssFileExtension,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
  if (!options.translationSupport) {
    tree.delete(join(options.projectRoot, 'src/plugins/i18n.ts'));
    tree.delete(join(options.projectRoot, 'src/stores/locales.ts'));
  }
}

export default async function (tree: Tree, options: ViteVueSpaGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: 'nx-vue-crew:build',
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
