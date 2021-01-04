import Backbone from 'backbone'
import { html, render } from 'lit-html'

import {
  mdiArrowCollapseRight,
  mdiArrowExpandLeft,
  mdiChevronDown,
} from '@mdi/js'

import AuthURLModel from '../models/AuthURLModel'

import { icon as iconTemplate } from '../templates'

import classes from '../styles/notConnected'

const template = () => html`
  <div class=${classes.notConnected}>
    <h1 class=${classes.title}>Transcendence</h1>
    <div class=${classes.connectionCenter}>
      <button class=${classes.connectButton} id="connect-button">
        Connect
      </button>
    </div>
  </div>
`

export default class NotConnectedView extends Backbone.View {
  constructor(args = {}) {
    super({
      events: {
        'click button#connect-button': 'connect',
      },
      ...args,
    })
    this.render()
  }
  remove() {
    this.undelegateEvents()
  }
  render() {
    render(template(), this.el)
  }
  connect() {
    const authUrl = new AuthURLModel()
    authUrl.fetch().done(({ url }) => {
      window.location.assign(url)
    })
  }
}
