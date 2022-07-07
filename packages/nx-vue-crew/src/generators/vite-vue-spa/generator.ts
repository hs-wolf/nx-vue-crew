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
  ProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { Schema, NormalizedSchema } from './schema';
import {
  CSSExtensions,
  CSSFrameworks,
  vite,
  vitejsPluginVue,
  vue,
  vueRouter,
  vueUseCore,
  vueUseHead,
  pinia,
  veeValidate,
  intlifyVitePluginVueI18n,
  vueI18n,
  veeValidateI18n,
  vitePluginPages,
  vitePluginVueLayouts,
  unpluginAutoImport,
  unpluginVueComponents,
  unpluginIcons,
  sass,
  postcss,
  autoprefixer,
  tailwindcss,
  vitePluginWindicss,
  windicss,
} from './constants';

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

function createApplicationFiles(tree: Tree, options: NormalizedSchema) {
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
  console.log(CSSFrameworks);
  if (options.cssFramework !== CSSFrameworks.tailwindcss) {
    tree.delete(join(options.projectRoot, 'tailwind.config.js'));
    tree.delete(join(options.projectRoot, 'postcss.config.js'));
  }
  if (options.cssFramework !== CSSFrameworks.windicss) {
    tree.delete(join(options.projectRoot, 'windi.config.ts'));
  }
}

function createServeTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: 'nx-vue-crew:dev',
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      baseHref: '/',
      configFile: 'vite.config.ts',
    },
    configurations: {
      production: {
        fileReplacements: [
          {
            replace: joinPathFragments(
              options.projectRoot,
              `src/environments/environment.ts`
            ),
            with: joinPathFragments(
              options.projectRoot,
              `src/environments/environment.prod.ts`
            ),
          },
        ],
      },
    },
  };
}

function createBuildTarget(
  project: ProjectConfiguration,
  options: NormalizedSchema
): TargetConfiguration {
  return {
    executor: 'nx-vue-crew:build',
    outputs: ['{options.outputPath}'],
    defaultConfiguration: 'production',
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      baseHref: '/',
      configFile: 'vite.config.ts',
    },
    configurations: {
      production: {
        optimization: true,
        extractLicenses: true,
        inspect: false,
        fileReplacements: [
          {
            replace: joinPathFragments(
              project.sourceRoot,
              'environments/environment.ts'
            ),
            with: joinPathFragments(
              project.sourceRoot,
              'environments/environment.prod.ts'
            ),
          },
        ],
      },
    },
  };
}

function createProject(tree: Tree, options: NormalizedSchema) {
  const project: ProjectConfiguration = {
    root: options.projectRoot,
    sourceRoot: joinPathFragments(options.projectRoot, 'src'),
    projectType: 'application',
    targets: {},
    tags: options.parsedTags,
  };
  project.targets.serve = createServeTarget(options);
  project.targets.serve = createBuildTarget(project, options);

  addProjectConfiguration(tree, options.projectName, project);

  const workspace = readWorkspaceConfiguration(tree);
  if (!workspace.defaultProject) {
    workspace.defaultProject = options.name;
    updateWorkspaceConfiguration(tree, workspace);
  }
}

function addPackages(tree: Tree, options: NormalizedSchema) {
  const dependencies = {
    [vue.name]: vue.version,
    [vueRouter.name]: vueRouter.version,
    [pinia.name]: pinia.version,
    [veeValidate.name]: veeValidate.version,
  };
  const optionalDependencies = () => {
    const packages = {};
    if (options.translationSupport) {
      Object.assign(packages, {
        [vueI18n.name]: vueI18n.version,
        [veeValidateI18n.name]: veeValidateI18n.version,
      });
    }
    return packages;
  };
  const finaldependencies = Object.assign(dependencies, optionalDependencies());

  const devDependencies = {
    [vite.name]: vite.version,
    [vitejsPluginVue.name]: vitejsPluginVue.version,
    [vueUseCore.name]: vueUseCore.version,
    [vueUseHead.name]: vueUseHead.version,
  };
  const optionalDevDependencies = () => {
    const packages = {};
    if (options.translationSupport) {
      Object.assign(packages, {
        [intlifyVitePluginVueI18n.name]: intlifyVitePluginVueI18n.version,
      });
    }
    if (options.automatizations) {
      Object.assign(packages, {
        [vitePluginPages.name]: vitePluginPages.version,
        [vitePluginVueLayouts.name]: vitePluginVueLayouts.version,
        [unpluginAutoImport.name]: unpluginAutoImport.version,
        [unpluginVueComponents.name]: unpluginVueComponents.version,
      });
    }
    if (options.onDemandSvgIcons) {
      Object.assign(packages, {
        [unpluginIcons.name]: unpluginIcons.version,
      });
    }
    if (options.cssExtension === CSSExtensions.sass) {
      Object.assign(packages, {
        [sass.name]: sass.version,
      });
    }
    if (options.cssFramework === CSSFrameworks.tailwindcss) {
      Object.assign(packages, {
        [postcss.name]: postcss.version,
        [autoprefixer.name]: autoprefixer.version,
        [tailwindcss.name]: tailwindcss.version,
      });
    }
    if (options.cssFramework === CSSFrameworks.windicss) {
      Object.assign(packages, {
        [vitePluginWindicss.name]: vitePluginWindicss.version,
        [windicss.name]: windicss.version,
      });
    }
    return packages;
  };
  const finalDevDependencies = Object.assign(
    devDependencies,
    optionalDevDependencies()
  );

  return addDependenciesToPackageJson(
    tree,
    finaldependencies,
    finalDevDependencies
  );
}

export default async function (tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const tasks: GeneratorCallback[] = [];
  createApplicationFiles(tree, normalizedOptions);
  createProject(tree, normalizedOptions);
  tasks.push(addPackages(tree, normalizedOptions));
  await formatFiles(tree);
  return runTasksInSerial(...tasks);
}
