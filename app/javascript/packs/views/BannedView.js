import Backbone from 'backbone'
import { html, render } from 'lit-html'

import css from '../styles/banned'

const template = () => html`
  <div class=${css.banned}>
    <h1>You are banned.</h1>
  </div>
`

export default class FakeConnectView extends Backbone.View {
  constructor(args = {}) {
    super({
      ...args,
    })
  }
  render() {
    render(template(), this.el)
  }
  remove() {
    this.undelegateEvents()
  }
}
