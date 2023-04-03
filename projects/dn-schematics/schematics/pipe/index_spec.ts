/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
// @ts-ignore
import { Schema as ApplicationOptions } from '../application/schema';
import { createAppModule, getFileContent } from '../utility/test';
// @ts-ignore
import { Schema as WorkspaceOptions } from '../workspace/schema';
// @ts-ignore
import { Schema as PipeOptions } from './schema';
import jasmine from 'jasmine';

describe('Pipe Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@schematics/angular',
    require.resolve('../collection.json')
  );
  const defaultOptions: PipeOptions = {
    name: 'foo',
    module: undefined,
    export: false,
    flat: true,
    project: 'bar',
  };

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };

  const appOptions: ApplicationOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    skipTests: false,
    skipPackageJson: false,
  };
  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await schematicRunner.runSchematic('workspace', workspaceOptions);
    appTree = await schematicRunner.runSchematic(
      'application',
      appOptions,
      appTree
    );
  });

  it('should create a pipe', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic('pipe', options, appTree);
    const files = tree.files;
    expect(files).toContain('/projects/bar/src/app/foo.pipe.spec.ts');
    expect(files).toContain('/projects/bar/src/app/foo.pipe.ts');
    const moduleContent = getFileContent(
      tree,
      '/projects/bar/src/app/app.module.ts'
    );
    expect(moduleContent).toMatch(/import.*Foo.*from '.\/foo.pipe'/);
    expect(moduleContent).toMatch(
      /declarations:\s*\[[^\]]+?,\r?\n\s+FooPipe\r?\n/m
    );
    const fileContent = tree.readContent('/projects/bar/src/app/foo.pipe.ts');
    expect(fileContent).toContain(
      'transform(value: unknown, ...args: unknown[])'
    );
  });

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = await schematicRunner.runSchematic('pipe', options, appTree);
    const appModule = getFileContent(
      tree,
      '/projects/bar/src/app/app.module.ts'
    );

    expect(appModule).toMatch(/import { FooPipe } from '.\/foo.pipe'/);
  });

  it('should fail if specified module does not exist', async () => {
    const options = {
      ...defaultOptions,
      module: '/projects/bar/src/app/app.moduleXXX.ts',
    };

    await expectAsync(
      schematicRunner.runSchematic('pipe', options, appTree)
    ).toBeRejected();
  });

  it('should handle a path in the name and module options', async () => {
    appTree = await schematicRunner.runSchematic(
      'module',
      { name: 'admin/module', project: 'bar' },
      appTree
    );

    const options = { ...defaultOptions, module: 'admin/module' };
    appTree = await schematicRunner.runSchematic('pipe', options, appTree);

    const content = appTree.readContent(
      '/projects/bar/src/app/admin/module/module.module.ts'
    );
    expect(content).toMatch(/import { FooPipe } from '\.\.\/\.\.\/foo.pipe'/);
  });

  it('should export the pipe', async () => {
    const options = { ...defaultOptions, export: true };

    const tree = await schematicRunner.runSchematic('pipe', options, appTree);
    const appModuleContent = getFileContent(
      tree,
      '/projects/bar/src/app/app.module.ts'
    );
    expect(appModuleContent).toMatch(/exports: \[\n(\s*) {2}FooPipe\n\1\]/);
  });

  it('should respect the flat flag', async () => {
    const options = { ...defaultOptions, flat: false };

    const tree = await schematicRunner.runSchematic('pipe', options, appTree);
    const files = tree.files;
    expect(files).toContain('/projects/bar/src/app/foo/foo.pipe.spec.ts');
    expect(files).toContain('/projects/bar/src/app/foo/foo.pipe.ts');
    const moduleContent = getFileContent(
      tree,
      '/projects/bar/src/app/app.module.ts'
    );
    expect(moduleContent).toMatch(/import.*Foo.*from '.\/foo\/foo.pipe'/);
    expect(moduleContent).toMatch(
      /declarations:\s*\[[^\]]+?,\r?\n\s+FooPipe\r?\n/m
    );
  });

  it('should use the module flag even if the module is a routing module', async () => {
    const routingFileName = 'app-routing.module.ts';
    const routingModulePath = `/projects/bar/src/app/${routingFileName}`;
    const newTree = createAppModule(appTree, routingModulePath);
    const options = { ...defaultOptions, module: routingFileName };
    const tree = await schematicRunner.runSchematic('pipe', options, newTree);
    const content = getFileContent(tree, routingModulePath);
    expect(content).toMatch(/import { FooPipe } from '.\/foo.pipe/);
  });

  it('should respect the sourceRoot value', async () => {
    const config = JSON.parse(appTree.readContent('/angular.json'));
    config.projects.bar.sourceRoot = 'projects/bar/custom';
    appTree.overwrite('/angular.json', JSON.stringify(config, null, 2));

    // should fail without a module in that dir
    await expectAsync(
      schematicRunner.runSchematic('pipe', defaultOptions, appTree)
    ).toBeRejected();

    // move the module
    appTree.rename(
      '/projects/bar/src/app/app.module.ts',
      '/projects/bar/custom/app/app.module.ts'
    );
    appTree = await schematicRunner.runSchematic(
      'pipe',
      defaultOptions,
      appTree
    );
    expect(appTree.files).toContain('/projects/bar/custom/app/foo.pipe.ts');
  });

  it('should respect the skipTests flag', async () => {
    const options = { ...defaultOptions, skipTests: true };

    const tree = await schematicRunner.runSchematic('pipe', options, appTree);
    const files = tree.files;
    expect(files).not.toContain('/projects/bar/src/app/foo.pipe.spec.ts');
    expect(files).toContain('/projects/bar/src/app/foo.pipe.ts');
  });

  it('should create a standalone pipe', async () => {
    const options = { ...defaultOptions, standalone: true };
    const tree = await schematicRunner.runSchematic('pipe', options, appTree);
    const moduleContent = tree.readContent(
      '/projects/bar/src/app/app.module.ts'
    );
    const pipeContent = tree.readContent('/projects/bar/src/app/foo.pipe.ts');
    expect(pipeContent).toContain('standalone: true');
    expect(pipeContent).toContain('class FooPipe');
    expect(moduleContent).not.toContain('FooPipe');
  });

  it('should error when class name contains invalid characters', async () => {
    const options = { ...defaultOptions, name: '1Clazz' };

    await expectAsync(
      schematicRunner.runSchematic('pipe', options, appTree)
    ).toBeRejectedWithError('Class name "1Clazz" is invalid.');
  });
});
