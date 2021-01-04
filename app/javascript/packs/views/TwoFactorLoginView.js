import Backbone from 'backbone'
import { html, render } from 'lit-html'

import { icon as iconTemplate } from '../templates'
import { mdiAlertCircle } from '@mdi/js'
import css from '../styles/twoFactorLogin'

import router from '../router'
import ValidateGAuthModel from '../models/ValidateGAuthModel'

const template = ({ errorMsg }) => html`
  <div class=${css.twoFactorLogin}>
    <form class=${css.container} id="2fa-form">
      <div class=${css.logoCtnr}>
        <img src="/imgs/googleAuthenticator.png" />
      </div>
      <span class=${css.desc}>Enter your PIN</span>
      <div class=${css.inputPin}>
        <input id="2fa-input-pin" placeholder="000000" />
      </div>
      <div
        class=${css.error}
        style="visibility: ${errorMsg ? 'visible' : 'hidden'}"
      >
        <div class=${css.errIcon}>${iconTemplate(mdiAlertCircle)}</div>
        <span class=${css.errMsg}>${errorMsg}</span>
      </div>
      <div class=${css.go}>
        <button type="submit">Go!</button>
      </div>
    </form>
  </div>
`

export default class TwoFactorLoginView extends Backbone.View {
  constructor(args = {}) {
    super({
      events: {
        'submit form#2fa-form': 'connect',
      },
      ...args,
    })
    this.errorMsg = null
    this.render()
  }
  remove() {
    this.undelegateEvents()
  }
  render() {
    render(template({ errorMsg: this.errorMsg }), this.el)
  }
  connect(ev) {
    ev.preventDefault()
    const pin = this.$('#2fa-input-pin').val()

    new ValidateGAuthModel({ pin })
      .save()
      .done(() => {
        router.navigate('/', { trigger: true })
      })
      .fail(e => {
        const msg = e.responseJSON && e.responseJSON.message
        this.errorMsg = msg || 'Unknown error'
        if (!msg) console.error(e.responseText)
        this.render()
      })
  }
}
