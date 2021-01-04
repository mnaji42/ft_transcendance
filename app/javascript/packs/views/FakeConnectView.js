import Backbone from 'backbone'
import { html, render } from 'lit-html'

import FakeConnectModel from '../models/FakeConnectModel'

import router from '../router'

const template = () => html`
  <form id="fake-connect">
    <input placeholder="login" />
    <button type="submit">Connect</button>
  </form>
`

export default class FakeConnectView extends Backbone.View {
  constructor(args = {}) {
    super({
      events: {
        'submit #fake-connect': 'connect',
      },
      ...args,
    })
    this.render()
  }
  render() {
    render(template(), this.el)
    this.$('#fake-connect > input').focus()
  }
  async connect(ev) {
    ev.preventDefault()
    await new FakeConnectModel({ login: this.$('#fake-connect > input').val() })
      .save()
      .promise()
    router.navigate('/', { trigger: true })
  }
  remove() {
    this.undelegateEvents()
  }
}
