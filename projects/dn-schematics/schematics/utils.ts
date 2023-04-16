import {
  strings,
  SchematicsException,
  Tree,
  apply,
  url,
  applyTemplates,
  move,
  chain,
  mergeWith,
} from '@angular-devkit/schematics';
import { normalize, virtualFs, workspaces } from '@angular-devkit/core';
import { buildDefaultPath, ProjectDefinition } from './utility/workspace';
import { findModuleFromOptions } from './utility/find-module';
import { parseName } from './utility/parse-name';
import { validateHtmlSelector } from './utility/validation';
import { addDeclarationToNgModule } from './utility/add-declaration-to-ng-module';

export function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      console.log('readFile path : ', path);

      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },

    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },

    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },

    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

export function buildSelector(options: any, projectPrefix: string) {
  let selector = strings.dasherize(options.name);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
}

export async function createComponent(options: any, tree: Tree) {
  const host = createHost(tree);
  const { workspace } = await workspaces.readWorkspace('/', host);

  const libraryProjectName: string = workspace.extensions[
    'defaultProject'
  ] as string;

  if (!libraryProjectName) {
    throw new SchematicsException(
      `defaultProject 가 존재하지 않습니다. angular.json에 defaultProject 를 추가해주세요..`
    );
  }

  const project = workspace.projects.get(options.project);

  if (!project) {
    throw new SchematicsException(
      `프로젝트 ${options.project} 은 존재하지 않습니다. 옵션에 프로젝트를 추가 혹은 변경 해주세요.`
    );
  }

  if (options.path === undefined) {
    options.path = buildDefaultPath(project as ProjectDefinition);
  }

  options.module = findModuleFromOptions(tree, options);

  const parsedPath = parseName(options.path as string, options.name);
  options.name = parsedPath.name;
  options.path = parsedPath.path;
  options.selector =
    options.selector ||
    buildSelector(options, (project && project.prefix) || '');

  validateHtmlSelector(options.selector);

  if (!options.prefix) {
    options.prefix = (project && project.prefix) || '';
  }

  if (!options.templatePath) {
    options.templatePath = './files/template';
  }

  console.log('options : ', options);

  const templateSource = apply(url(options.templatePath), [
    applyTemplates({
      classify: strings.classify,
      dasherize: strings.dasherize,
      camelize: strings.camelize,
      name: options.name,
      libraryProjectName,
      projectName: options.project,
      prefix: options.prefix,
      selector: options.selector,
    }),
    move(normalize(`${parsedPath.path}/${options.name}`)),
  ]);

  return chain([
    addDeclarationToNgModule({
      type: 'component',
      ...options,
    }),
    mergeWith(templateSource),
  ]);
}
