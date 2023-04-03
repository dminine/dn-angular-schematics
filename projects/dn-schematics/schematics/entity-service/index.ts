import {
  Rule,
  Tree,
  SchematicsException,
  apply,
  url,
  applyTemplates,
  move,
  chain,
  mergeWith,
} from '@angular-devkit/schematics';

import {
  strings,
  normalize,
  virtualFs,
  workspaces,
} from '@angular-devkit/core';

import { Schema as MyServiceSchema } from './schema';

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
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

export function entityService(options: MyServiceSchema): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);

    if (!options.project) {
      options.project = workspace.extensions['defaultProject'] as any;
    }

    const project = workspace.projects.get(options.project);

    if (!project) {
      throw new SchematicsException(`Invalid project name: ${options.project}`);
    }

    if (options.path === undefined) {
      options.path = `${project.sourceRoot}/lib/db/${options.name}`;
    }

    const entityPath: string = `src/entities/${options.name}`;

    const entityServiceSource = apply(url('./files/service-file'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        name: options.name,
      }),
      move(normalize(entityPath)),
    ]);

    const typesTemplateSource = apply(url('./files/types-file'), [
      applyTemplates({
        classify: strings.classify,
        name: options.name,
      }),
      move(normalize(entityPath)),
    ]);

    const ngServiceSource = apply(url('./files/ng-service-file'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        name: options.name,
      }),
      move(normalize(options.path as string)),
    ]);

    const dbSource = apply(url('./files/db-file'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        name: options.name,
      }),
      move(normalize(options.path as string)),
    ]);

    return chain([
      mergeWith(entityServiceSource),
      mergeWith(typesTemplateSource),
      mergeWith(ngServiceSource),
      mergeWith(dbSource),
    ]);
  };
}
