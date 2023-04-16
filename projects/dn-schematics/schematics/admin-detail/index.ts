import { Rule, Tree } from '@angular-devkit/schematics';
import { createComponent } from '../utils';

export function adminDetail(options: any): Rule {
  return async (tree: Tree) => {
    return createComponent(options, tree);
  };
}
