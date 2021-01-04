import { html } from 'lit-html'

import css from '../styles/icons'

export default (icon, args = { size: '24' }) => html`
  <span class=${css.mdi}>
    <svg
      class=${args.class || ''}
      width=${args.size}
      height=${args.size}
      viewBox="0 0 ${args.size} ${args.size}"
    >
      <path d=${icon}></path>
    </svg>
  </span>
`
