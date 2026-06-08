import axe from 'axe-core'

const wcag2aa: axe.RunOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa'],
  },
}

export function runAxe(container: Element) {
  return axe.run(container, wcag2aa)
}
