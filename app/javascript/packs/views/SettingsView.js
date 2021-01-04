import Backbone from 'backbone'
import { html, render } from 'lit-html'

import { icon as iconTemplate } from '../templates'
import { mdiClose, mdiAlertCircle } from '@mdi/js'

import { update as updateUser } from '../currentUser'

import UserModel from '../models/UserModel'
import GAuthModel from '../models/GAuthModel'
import SetupGAuthModel from '../models/SetupGAuthModel'
import RemoveGAuthModel from '../models/RemoveGAuthModel'

import currentUser from '../currentUser'

import css from '../styles/settings'

const template = ({ user, showGAuth, gauthQR, errMsg, gauthEnabled }) => html`
  <div class=${css.settings}>
    <div class=${css.bar}>
      <span class=${css.title}>Settings</span>
      <button class=${css.close} id="settings-bar-close">
        ${iconTemplate(mdiClose)}
      </button>
    </div>
    <div class=${css.content}>
      <div class=${css.fields}>
        <div class=${css.field}>
          <label>Display name</label>
          <input id="settings-name" value="${user.displayname}" />
        </div>
        <div class=${css.field}>
          <label>Avatar</label>
          <input type="file" id="settings-file-input" />
        </div>
        <div class=${css.field}>
          <label>Preview</label>
          <img
            class=${css.avatarPreview}
            id="settings-file-preview"
            src="${user.avatar_url}"
          />
        </div>
      </div>
      <div class=${css.fields}>
        <span class=${css.contentHead}>Google Authenticator</span>
        ${showGAuth
          ? html`
              <div
                class=${css.gauthQR}
                id="settings-file-preview"
                style="background-image: url(${gauthQR})"
              ></div>
              <div class=${css.field}>
                <label>Pin code</label>
                <input placeholder="000000" id="settings-gauth-pin" />
              </div>
            `
          : html`
              <div class=${css.showGAuthCtnr}>
                ${gauthEnabled
                  ? html`
                      <button
                        class=${css.disableButton}
                        id="settings-gauth-remove"
                      >
                        Disable
                      </button>
                    `
                  : html`
                      <button id="settings-gauth-enable">Show</button>
                    `}
              </div>
            `}
      </div>
    </div>
    <div class=${css.bottom}>
      ${errMsg
        ? html`
            <div class=${css.errIcon}>${iconTemplate(mdiAlertCircle)}</div>
            <span class=${css.errMsg}>${errMsg}</span>
          `
        : ''}
      <button class=${css.saveButton} id="settings-bar-save">Save</button>
    </div>
  </div>
`

export default class SettingsView extends Backbone.View {
  constructor(args = {}) {
    super({
      events: {
        'click button#settings-bar-close': 'close',
        'click button#settings-bar-save': 'save',
        'click button#settings-gauth-enable': 'setShowGAuth',
        'click button#settings-gauth-remove': 'removeGAuth',
        'change #settings-file-input': 'previewAvatar'
      },
      ...args
    })
    this.showGAuth = false
    this.gauthQR = null
    this.gauthEnabled = null
    this.errMsg = null
    this.keyListener = ev => this.onKeyDown(ev)
    document.addEventListener('keydown', this.keyListener)
  }
  render() {
    this.gauthEnabled = currentUser().mfa_enabled

    render(
      template({
        user: currentUser(),
        showGAuth: this.showGAuth,
        gauthQR: this.gauthQR,
        errMsg: this.errMsg,
        gauthEnabled: this.gauthEnabled
      }),
      this.el
    )

    // document.getElementById('settings-name').value = currentUser().displayname
    // document.getElementById(
    //   'settings-file-preview'
    // ).src = currentUser().avatar_url
  }
  remove() {
    document.removeEventListener('keydown', this.keyListener)
    this.undelegateEvents()
  }
  previewAvatar() {
    const input = this.$('#settings-file-input').get(0)

    if (!input.files || !input.files[0]) return

    const reader = new FileReader()

    reader.addEventListener('load', e => {
      this.$('#settings-file-preview').attr('src', e.target.result)
    })
    reader.readAsDataURL(input.files[0])
  }
  setShowGAuth() {
    new GAuthModel().fetch().done(({ url }) => {
      this.gauthQR = url
      this.showGAuth = true
      this.render()
    })
  }
  close() {
    this.trigger('close')
  }
  async save() {
    const name = document.getElementById('settings-name').value
    const image = document.getElementById('settings-file-preview').src
    const gauthPin =
      this.showGAuth && document.getElementById('settings-gauth-pin').value

    this.errMsg = null

    if (!name) {
      this.error('Your display name cannot be empty!')
      return
    }
    if (!image) {
      this.error('You must select an image!')
      return
    }
    if (this.showGAuth && !gauthPin) {
      this.error('The PIN code is invalid!')
      return
    }

    try {
      await new UserModel({
        id: currentUser().id,
        displayname: name,
        avatar_url: image,
        default_settings: false
      })
        .save()
        .promise()

      if (this.showGAuth)
        await new SetupGAuthModel({ pin: gauthPin }).save().promise()
      this.errMsg = null
      this.showGAuth = false
      this.gauthQR = null
      this.gauthEnabled = null

      updateUser(true)
      this.close()
    } catch (e) {
      const msg = e.responseJSON && e.responseJSON.message
      this.error(msg || 'Unknown error')
    }
  }
  removeGAuth() {
    new RemoveGAuthModel()
      .save()
      .done(() => this.render())
      .fail(e => {
        const msg = e.responseJSON && e.responseJSON.message
        this.error(msg || 'Unknown error')
      })
  }
  error(e) {
    this.errMsg = e
    this.render()
  }
  onKeyDown(ev) {
    if (ev.key === 'Escape') this.close()
  }
}
