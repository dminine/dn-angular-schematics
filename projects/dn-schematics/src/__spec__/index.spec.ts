import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

describe('test', () => {
  const schematicRunner = new SchematicTestRunner(
    '@schematics/angular',
    require.resolve('../../schematics/collection.json')
  );
  //
  // const workspaceOptions: any = {
  //   name: 'workspace',
  //   newProjectRoot: 'projects',
  //   version: '6.0.0',
  // };
  //
  // const appOptions: any = {
  //   name: 'bar',
  //   inlineStyle: false,
  //   inlineTemplate: false,
  //   routing: false,
  //   skipTests: false,
  //   skipPackageJson: false,
  // };

  // let appTree: UnitTestTree;
  beforeEach(async () => {
    // appTree = await schematicRunner.runSchematic('workspace', workspaceOptions);
    // appTree = await schematicRunner.runSchematic(
    //   'application',
    //   appOptions,
    //   appTree
    // );
  });

  it('return true', () => {
    expect(true).toBeTrue();
  });
});
