import { axe } from 'jest-axe'

export const wcag2aa = {
  runOnly: {
    type: 'tag' as const,
    values: ['wcag2a', 'wcag2aa'],
  },
}

export function runAxe(container: Element) {
  return axe(container, wcag2aa)
}
