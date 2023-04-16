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
  workspaces,
} from '@angular-devkit/core';

import { Schema as MyServiceSchema } from './schema';
import { findModuleFromOptions } from '../utility/find-module';
import { createHost } from '../utils';

export function entityService(options: MyServiceSchema): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);

    console.log('entityService workspace : ', workspace);

    const project = workspace.projects.get(options.project);

    console.log('project : ', project);

    options.module = findModuleFromOptions(tree, options);

    console.log('options', options);
    //
    // addDeclarationToNgModule({
    //   type: 'component',
    //   ...options,
    // });

    if (!project) {
      throw new SchematicsException(
        `프로젝트 ${options.project} 은 존재하지 않습니다. 옵션에 프로젝트를 추가 혹은 변경 해주세요.`
      );
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
