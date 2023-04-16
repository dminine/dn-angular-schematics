import { Rule, Tree } from '@angular-devkit/schematics';
import { createComponent } from '../utils';

export function adminAdd(options: any): Rule {
  return async (tree: Tree) => {
    return createComponent(options, tree);
  };
}
