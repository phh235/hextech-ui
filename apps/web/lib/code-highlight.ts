/** Native Fumadocs/Shiki colors with a small light-mode contrast correction.
 * Latte foregrounds target >=4.65:1 on the light code surface (#ececec).
 * https://shiki.style/guide/theme-colors#color-replacements
 */
export const codeHighlightOptions = {
  themes: {
    light: 'catppuccin-latte',
    dark: 'catppuccin-mocha',
  },
  colorReplacements: {
    'catppuccin-latte': {
      '#7c7f93': '#666879',
      '#40a02b': '#307720',
      '#ea76cb': '#9a4e86',
      '#fe640b': '#b34608',
      '#8839ef': '#8738ed',
      '#179299': '#12747a',
      '#1e66f5': '#1c5fe5',
      '#df8e1d': '#925d13',
      '#e64553': '#bb3844',
      '#d20f39': '#d00f38',
      '#04a5e5': '#03709c',
      '#dd7878': '#9b5454',
      '#dc8a78': '#915b4f',
      '#7287fd': '#5362b7',
      '#209fb5': '#177383',
      '#6c6f85': '#64677c',
    },
  },
} as const;
