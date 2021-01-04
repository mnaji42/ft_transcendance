import Backbone from 'backbone'
import { html, render } from 'lit-html'

import { icon as iconTemplate } from '../templates'
import { mdiSend } from '@mdi/js'

import currentUser, { disconnect } from '../currentUser'

import DisconnectModel from '../models/DisconnectModel'

import css from '../styles/chat'

const template = ({ user }) => html`
  <div class=${css.content}>
    <table>
      <tr style=${user.admin ? '' : 'display :none'}>
        <td style="color: #f2bb13">ADMIN</td>
      </tr>
      <tr style=${user.guild ? '' : 'display :none'}>
        <td>Guild:</td>
        <td>${user.guild ? user.guild.anagram : ''}</td>
        <td>${user.guild ? user.guild.name : ''}</td>
      </tr>
      <tr>
        <td>Victory:</td>
        <td>${user.win}</td>
        <td>Loss:</td>
        <td>${user.loss}</td>
      </tr>
      <tr>
        <td>Points:</td>
        <td>${user.points}</td>
        <td>Rank:</td>
        <td>${user.rank}</td>
      </tr>
    </table>
    <button class=${css.contentButton} id="disconnect">Disconnect</button>
  </div>
`

export default class AccountView extends Backbone.View {
  constructor(args = {}) {
    super({
      events: {
        'click button#disconnect': 'disconnect',
      },
      ...args,
    })
    this.render()
  }
  remove() {
    this.undelegateEvents()
  }
  render() {
    render(template({ user: currentUser() }), this.el)
  }
  async disconnect() {
    await disconnect()
  }
}
