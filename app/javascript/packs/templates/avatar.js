import { html } from 'lit-html'

import css from '../styles/avatar'

export default ({ picture, status }) => html`
  <a class=${css.avatar}>
    <div class=${css.picture} style="background-image: url(${picture})"></div>
    <div class="${css.status} ${css[`status-${status}`]}"></div>
  </a>
`
