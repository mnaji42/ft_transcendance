import { View, history } from 'backbone'
import { html, render } from 'lit-html'

import {
  mdiArrowCollapseRight,
  mdiArrowExpandLeft,
  mdiChevronDown,
  mdiBorderColor
} from '@mdi/js'

import GameModel from '../models/GameModel'

import ChatExpandView from './ChatExpandView'
import ChatCompactView from './ChatCompactView'
import SettingsView from './SettingsView'
import DefyRequestView from './DefyRequestView'
import HomeView from './HomeView'

import { icon as iconTemplate } from '../templates'

import css from '../styles/layout'

import currentUser from '../currentUser'
import AccountView from './AccountView'
import { createPopper } from '@popperjs/core'
import { pongGame } from '../pongGame'

const template = ({ chatOpen, user, settingsOpen, menu, defyRequest }) => html`
  <div
    class="${css.settingsFilter} ${css.settingsFilterOpen}"
    style=${settingsOpen || defyRequest ? '' : 'display: none'}
    id="app-settings-filter"
  ></div>
  <div
    class=${css.settings}
    style=${settingsOpen || defyRequest ? '' : 'display: none'}
    id="app-settings"
  ></div>
  <div class=${css.app}>
    <nav class=${css.navbar}>
      <span class=${css.navbarTitle}>Transcendence</span>
      <a
        class="${css.navbarLink} ${menu == 'Home' ? css.navbarLinkCurrent : ''}"
        id="home-menu"
        >Home</a
      >
      <a
        class="${css.navbarLink} ${menu == 'Guilds'
          ? css.navbarLinkCurrent
          : ''}"
        id="guilds-menu"
        >Guilds</a
      >
      <a
        class="${css.navbarLink} ${menu == 'Friends'
          ? css.navbarLinkCurrent
          : ''}"
        id="friends-menu"
        >Friends</a
      >
      <a
        class="${css.navbarLink} ${menu == 'Admin'
          ? css.navbarLinkCurrent
          : ''}"
        style=${currentUser().admin ? '' : 'display: none'}
        id="admin-menu"
        >Admin</a
      >
      <a
        title="settings"
        class="${css.navbarIcone} ${settingsOpen ? css.navbarIconeCurrent : ''}"
        id="settings-menu"
        >${iconTemplate(mdiBorderColor)}</a
      >
      <div class=${css.navbarSeparator}></div>
      <div class=${css.accountMenu}>
        <div class=${css.navbarAccount} id="navbar-account">
          <div
            class=${css.navbarAccountPicture}
            style="background-image: url(${user.avatar_url})"
          ></div>
          <span class=${css.navbarAccountName}> ${user.displayname} </span>
          <button class=${css.navbarAccountMenu}>
            ${iconTemplate(mdiChevronDown)}
          </button>
        </div>
        <div class=${css.account} id="account-menu"></div>
      </div>
    </nav>
    <div class=${css.inner}>
      <main class=${css.content} id="app-content"></main>
      <div class=${css.appChat} style="width: ${chatOpen ? '300px' : '75px'}">
        <div class=${css.chat} style="width: ${chatOpen ? '300px' : '75px'}">
          <div class=${css.chatContent} id="chat-content"></div>
          <button class=${css.chatCollapse} id="chat-collapse">
            ${iconTemplate(
              chatOpen ? mdiArrowCollapseRight : mdiArrowExpandLeft
            )}
          </button>
        </div>
        <div class=${css.browserContainer} id="browserContainer">
          <input
            type="checkbox"
            id="playerReduce"
            name="playerReduce"
            value="playerReduce"
            class=${css.checkBoxPlayerReduce}
            style=${'display: none'}
          />
          <input
            type="checkbox"
            id="playerExtend"
            name="playerExtend"
            value="playerExtend"
            class=${css.checkBoxPlayerExtend}
            style=${'display: none'}
          />
          <label class=${css.cta} for="playerReduce">
            <span class=${css.spanCta}>
              <svg width="100%" height="100%" viewBox="0 0 66 43">
                <g>
                  <path
                    class=${css.one}
                    d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                    fill="#FFFFFF"
                  ></path>
                  <path
                    class=${css.two}
                    d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                    fill="#FFFFFF"
                  ></path>
                  <path
                    class=${css.three}
                    d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                    fill="#FFFFFF"
                  ></path>
                </g>
              </svg>
            </span>
          </label>
          <div class=${css.browserBackground}></div>
          <div class=${css.browser}>
            <div class=${css.topBar}>
              <label class=${css.quit} id="quitSpectate"></label>
              <label class=${css.extend} for="playerExtend"></label>
            </div>
            <div class=${css.specContent}>
              <canvas id="spectateCanvas" class=${css.pongGame}>
                <p>Sorry your navigator doesn't support canvas</p>
              </canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`

export default class LayoutView extends View {
  constructor(args = {}) {
    super({
      events: {
        'click button#chat-collapse': 'chatCollapseButton',
        'click a#home-menu': 'home',
        'click a#guilds-menu': 'guilds',
        'click a#friends-menu': 'friends',
        'click a#admin-menu': 'admin',
        'click a#settings-menu': 'toggleSettingsOpen',
        'click div#navbar-account': 'account',
        'click #app-settings-filter': 'toggleSettingsOpen',
        'click #quitSpectate': 'quitSpectate'
      },
      ...args
    })
    this.chatOpen = true
    this.settingsOpen = false
    this.defyRequest = null
    this.view = null
    this.notificationsChannel = null

    this.chatViewExpand = new ChatExpandView()
    this.chatViewCompact = new ChatCompactView()

    this.settingsView = new SettingsView()
    this.defyRequestView = null

    this.accountView = null
  }
  async render() {
    if (!this.notificationsChannel) {
      let resolvePromise
      const promise = new Promise(res => (resolvePromise = res))
      this.notificationsChannel = consumer.subscriptions.create(
        'NotificationsChannel',
        {
          subscribed: () => {
            resolvePromise()
          },
          unsubscribed: () => {},
          received: event => {
            if (event.notification === 'defy')
              this.setDefyRequest(
                {
                  request: event.request,
                  user: event.user
                },
                false
              )
            if (event.notification === 'war_defy')
              this.setDefyRequest(
                {
                  request: event.request,
                  user: event.user
                },
                true
              )
            if (event.notification === 'defy_accept') {
              this.home()
              setTimeout(
                () =>
                  this.view.pongGame({
                    gameId: event.game.id,
                    training: false,
                    gameMode: 'Duel',
                    maxScore: event.game.max_score,
                    map: event.map || 'MapDefault',
                    bonus: event.game.bonus,
                    lvl: 0,
                    friend: '',
                    player: event.game.player1_id === currentUser().id ? 1 : 2
                  }),
                1000
              )
            }
            if (event.notification === 'war_defy_accept') {
              this.home()
              setTimeout(
                () =>
                  this.view.pongGame({
                    gameId: event.game.id,
                    training: false,
                    gameMode: 'War',
                    maxScore: event.game.max_score,
                    map: 'MapDefault',
                    bonus: event.game.bonus,
                    lvl: 0,
                    friend: '',
                    player: event.game.player1_id === currentUser().id ? 1 : 2
                  }),
                1000
              )
            }
            if (event.notification === 'you_are_banned') {
              location.reload()
            }
          }
        }
      )

      // await promise
    }

    render(
      template({
        chatOpen: this.chatOpen,
        user: currentUser(),
        settingsOpen: this.settingsOpen,
        menu: this.view.name,
        defyRequest: !!this.defyRequestView,
        accountOpen: !!this.accountView
      }),
      this.el
    )

    this.view.setElement(this.$('#app-content'))
    this.chatViewExpand.setElement(this.$('#chat-content'))
    this.chatViewCompact.setElement(this.$('#chat-content'))
    this.settingsView.setElement(this.$('#app-settings'))
    if (this.defyRequestView)
      this.defyRequestView.setElement(this.$('#app-settings'))
    if (this.accountView) this.accountView.setElement(this.$('#account-menu'))

    this.view.render()

    if (this.chatOpen) this.chatViewExpand.render()
    else this.chatViewCompact.render()

    if (this.accountView) this.accountView.render()

    if (this.defyRequestView) {
      this.defyRequestView.render()
      this.listenToOnce(this.defyRequestView, 'close', () =>
        this.setDefyRequest(null)
      )
    } else if (this.settingsOpen) {
      this.settingsView.render()
      this.listenToOnce(this.settingsView, 'close', () =>
        this.toggleSettingsOpen()
      )
    }
  }
  remove() {
    this.view.remove()
    this.chatViewCompact.remove()
    this.chatViewExpand.remove()
    this.settingsView.remove()

    if (this.spectateChannel) {
      this.spectateChannel.unsubscribe()
      this.spectateChannel = null
    }

    if (this.defyRequestView) this.defyRequestView.remove()
    if (this.notificationsChannel) this.notificationsChannel.unsubscribe()
    this.undelegateEvents()
  }
  chatCollapseButton() {
    this.account = false
    this.chatOpen = !this.chatOpen
    if (this.chatOpen) this.chatViewCompact.remove()
    else this.chatViewExpand.remove()

    this.render()
  }
  toggleSettingsOpen() {
    if (this.settingsOpen) this.settingsView.remove()
    this.settingsOpen = !this.settingsOpen
    this.render()
  }
  setDefyRequest(defyRequest, isWar) {
    if (this.settingsOpen) {
      this.settingsView.remove()
      this.settingsOpen = false
    }
    if (this.defyRequestView) this.defyRequestView.remove()
    this.defyRequestView = defyRequest
      ? new DefyRequestView({ data: defyRequest, isWar })
      : null
    this.render()
  }

  home() {
    this.view.remove()
    this.setContent(new HomeView())
    history.navigate('/', { trigger: true })
  }
  guilds() {
    history.navigate('/guilds', { trigger: true })
  }
  friends() {
    history.navigate('/friends', { trigger: true })
  }
  admin() {
    history.navigate('/admin', { trigger: true })
  }
  account() {
    if (this.accountView) {
      this.accountView.remove()
      this.accountView = null
    } else {
      this.accountView = new AccountView()
    }
    const el = this.$('#account-menu')[0]
    if (this.accountView) el.setAttribute('data-show', '')
    else el.removeAttribute('data-show')
    requestAnimationFrame(() =>
      createPopper(this.$('#navbar-account')[0], this.$('#account-menu')[0])
    )
    createPopper(this.$('#navbar-account')[0], this.$('#account-menu')[0])
    this.render()
  }

  setContent(view) {
    if (this.view) this.view.remove()
    this.view = view
    this.view.on('spectate', gameId => {
      this.spectate(gameId)
    })
    this.view.on('update-chat', () => {
      this.chatViewExpand.reload()
    })
    this.render()
  }

  async spectate(gameId) {
    if (this.spectateChannel) {
      this.quitSpectate()
    }

    document.getElementById('browserContainer').style = 'display: block'

    this.gameId = gameId

    const game = await new GameModel({ id: gameId }).fetch()
    if (game.status !== 'finished' && game.chat_room)
      await this.chatViewExpand.join(game.chat_room.id)

    await this.render()
    pongGame(this, {
      gameId,
      spectating: true,
      map: 'MapDefault',
      finished: game.status === 'finished'
    })
  }

  async quitSpectate() {
    document.getElementById('playerExtend').checked = false

    if (this.gameInterval) clearInterval(this.gameInterval)

    const game = await new GameModel({ id: this.gameId }).fetch()
    if (game.chat_room) await this.chatViewExpand.quit(game.chat_room.id)

    document.getElementById('browserContainer').style = 'display: none'
    this.spectateChannel.unsubscribe()
    this.spectateChannel = null
  }
}
