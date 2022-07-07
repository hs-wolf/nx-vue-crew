import { join } from 'path';
import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
  GeneratorCallback,
  getWorkspaceLayout,
  normalizePath,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { Schema, NormalizedSchema } from './schema';
import { vite, vitejsPluginVue } from './constants';

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = normalizePath(
    `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`
  );
  const { npmScope: projectScope } = getWorkspaceLayout(tree);
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
    join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
  if (!options.translationSupport) {
    tree.delete(join(options.projectRoot, 'src/plugins/i18n.ts'));
    tree.delete(join(options.projectRoot, 'src/stores/locales.ts'));
  }
}

function addProject(tree: Tree, normalizedOptions: NormalizedSchema) {
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
}

function addPackages(tree: Tree) {
  const dependencies = {};
  const finaldependencies = Object.assign(dependencies);

  const devDependencies = { [vite.name]: vite.version };
  const finaldevDependencies = Object.assign(devDependencies);

  return addDependenciesToPackageJson(
    tree,
    finaldependencies,
    finaldevDependencies
  );
}

export default async function (tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const tasks: GeneratorCallback[] = [];
  addFiles(tree, normalizedOptions);
  addProject(tree, normalizedOptions);
  tasks.push(addPackages(tree));
  runTasksInSerial(...tasks);
  await formatFiles(tree);
}
