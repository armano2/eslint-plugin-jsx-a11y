/**
 * @flow
 */

import {
  dom,
  roles,
} from 'aria-query';
import type { Node } from 'ast-types-flow';
import { getProp, getLiteralPropValue } from 'jsx-ast-utils';

const nonInteractiveRoles = new Set(
  [...roles.keys()]
    .filter(name => !roles.get(name).abstract)
    .filter(name => !roles.get(name).superClass.some(
      klasses => klasses.includes('widget')),
    ),
);

/**
 * Returns boolean indicating whether the given element has a role
 * that is associated with a non-interactive component. Non-interactive roles
 * include `listitem`, `article`, or `dialog`. These are roles that indicate
 * for the most part containers.
 *
 * Elements with these roles should not respond or handle user interactions.
 * For example, an `onClick` handler should not be assigned to an element with
 * the role `listitem`. An element inside the `listitem`, like a button or a
 * link, should handle the click.
 *
 * This utility returns true for elements that are assigned a non-interactive
 * role. It will return false for elements that do not have a role. So whereas
 * a `div` might be considered non-interactive, for the purpose of this utility,
 * it is considered neither interactive nor non-interactive -- a determination
 * cannot be made in this case and false is returned.
 */

const isNonInteractiveRole = (
  tagName: string,
  attributes: Array<Node>,
): boolean => {
  // Do not test higher level JSX components, as we do not know what
  // low-level DOM element this maps to.
  if ([...dom.keys()].indexOf(tagName) === -1) {
    return false;
  }

  const role = getLiteralPropValue(getProp(attributes, 'role'));
  return nonInteractiveRoles.has(role);
};

export default isNonInteractiveRole;