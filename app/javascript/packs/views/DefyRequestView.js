import Backbone from 'backbone'
import { html, render } from 'lit-html'

import { icon as iconTemplate } from '../templates'
import { mdiClose, mdiAlertCircle } from '@mdi/js'
import css from '../styles/defy'

import DefyAcceptModel from '../models/DefyAcceptModel'
import WarDefyAcceptModel from '../models/WarDefyAcceptModel'

import currentUser from '../currentUser'

const statusClass = status => {
  if (status === 'in_game') return css.inGame
  if (status === 'online') return css.online
  return css.offline
}

const statusText = status => {
  if (status === 'in_game') return 'In Game'
  if (status === 'online') return 'Online'
  return 'Offline'
}

const template = ({ user, isWar }) => html`
  <div class=${css.ctnr}>
    <div class=${css.bar}>
      <span class=${css.title}
        >${isWar ? '[War] ' : ''}You have been defied</span
      >
      <button class=${css.close} data-defy-bar-close>
        ${iconTemplate(mdiClose)}
      </button>
    </div>
    <div class=${css.content}>
      <div class=${css.avatarCtnr}>
        <div
          class=${css.avatar}
          style="background-image: url(${user.avatar_url})"
        ></div>
      </div>
      <div>
        <div class=${css.tooltipDisplayName}>
          ${user.displayname}
          <span class=${css.tooltipLogin}>${user.login}</span>
        </div>
        <div class=${css.innerRow}>
          <div>
            <div class=${css.rank}>Rank #${user.rank}</div>
            <div class="${css.statusText} ${statusClass(user.status)}">
              ${statusText(user.status)}
            </div>
            <div>${user.win} wins</div>
            <div>${user.loss} losses</div>
            <div>${user.won_tournaments} tournaments won</div>
          </div>
          ${user.guild
            ? html`<div>
                <div class=${css.guildAnagram}>Guild ${user.guild.anagram}</div>
                <div class=${css.guildTitle}>${user.guild.name}</div>
                <div>
                  ${isWar
                    ? "You have 20 seconds to accept, if you don't, your guild might lose some points."
                    : ''}
                </div>
              </div>`
            : null}
        </div>
      </div>
    </div>
    <div class=${css.bottom}>
      <button
        style=${isWar ? 'display: none' : ''}
        class=${css.btn}
        data-defy-bar-close
      >
        Reject
      </button>
      <button class=${css.btn} data-defy-accept>Accept</button>
    </div>
  </div>
`

export default class DefyRequestViewView extends Backbone.View {
  constructor({ data, isWar, ...args } = {}) {
    super({
      events: {
        'click [data-defy-bar-close]': 'close',
        'click [data-defy-accept]': 'accept',
      },
      ...args,
    })
    this.isWar = isWar
    this.data = data
    this.keyListener = ev => this.onKeyDown(ev)
    document.addEventListener('keydown', this.keyListener)
    this.render()
  }
  close() {
    this.trigger('close')
  }
  async accept() {
    const AcceptModel = this.isWar ? WarDefyAcceptModel : DefyAcceptModel
    await new AcceptModel({ defy_id: this.data.request.id }).save().promise()
    this.close()
  }
  render() {
    render(template({ isWar: this.isWar, ...this.data }), this.el)
  }
  remove() {
    document.removeEventListener('keydown', this.keyListener)
    this.undelegateEvents()
  }
  onKeyDown(ev) {
    if (ev.key === 'Escape') this.close()
  }
}
