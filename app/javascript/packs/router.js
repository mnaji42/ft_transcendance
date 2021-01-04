import $ from 'jquery'
import { Router, history } from 'backbone'

import CurrentUserModel from './models/CurrentUserModel'

import './styles/global'

import currentUser, { update as updateUser } from './currentUser'

import LayoutView from './views/LayoutView'
import NotConnectedView from './views/NotConnectedView'
import BannedView from './views/BannedView'
import TwoFactorLoginView from './views/TwoFactorLoginView'
import FakeConnectView from './views/FakeConnectView'
import ContentHomeView from './views/HomeView'
import AdminView from './views/admin/AdminView'
import GuildView from './views/guild/GuildView'
import FriendView from './views/friend/FriendView'
import ProfileView from './views/profile/ProfileView'

class App extends Router {
  constructor() {
    super({
      // prettier-ignore
      routes: {
        '': 'index',
        '2fa': 'twofa',
        'fakeconnect': 'fakeconnect',
        'admin': 'admin',
        'guilds': 'guilds',
        'friends': 'friends',
        'profile/:id': 'profile',
      }
    })
    this.view = null
  }

  init() {
    history.start({ pushState: true })
    if (this.view) this.view.render()
  }

  async layout() {
    try {
      if (!currentUser()) await updateUser(false, this)

      if (currentUser().banned) {
        if (this.view) this.view.remove()

        this.view = new BannedView({
          el: $('#app'),
          router: this
        })
        return
      }

      if (this.view instanceof LayoutView) return

      if (this.view) this.view.remove()
      this.view = new LayoutView({
        el: $('#app'),
        router: this
      })
    } catch (e) {
      if (this.view) this.view.remove()

      this.view = new NotConnectedView({
        el: $('#app'),
        router: this
      })
    }
  }

  async index() {
    await this.layout()
    if (currentUser() && !currentUser().banned)
      this.view.setContent(new ContentHomeView({ router: this }))

    this.view.render()
  }
  async admin() {
    await this.layout()
    if (currentUser() && !currentUser().banned)
      this.view.setContent(new AdminView({ router: this }))

    this.view.render()
  }
  async friends() {
    await this.layout()
    if (currentUser() && !currentUser().banned)
      this.view.setContent(new FriendView({ router: this }))

    this.view.render()
  }
  async guilds() {
    await this.layout()
    if (currentUser() && !currentUser().banned)
      this.view.setContent(new GuildView({ router: this }))

    this.view.render()
  }
  async profile(id) {
    await this.layout()
    if (currentUser() && !currentUser().banned)
      this.view.setContent(new ProfileView({ router: this, id }))

    this.view.render()
  }

  twofa() {
    if (this.view) this.view.remove()

    this.view = new TwoFactorLoginView({
      el: $('#app'),
      router: this
    })

    this.view.render()
  }

  fakeconnect() {
    if (this.view) this.view.remove()

    this.view = new FakeConnectView({
      el: $('#app'),
      router: this
    })

    this.view.render()
  }

  async userUpdated() {
    if (!this.view) return

    const Constructor = this.view.view.constructor
    this.layout(
      new Constructor({
        router: this,
        id: this.view.id
      })
    )
    await this.view.render()
  }
}

export default new App()
