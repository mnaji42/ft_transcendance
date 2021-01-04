import Backbone from 'backbone'
import { html, render } from 'lit-html'
import dayjs from 'dayjs'
import { createPopper } from '@popperjs/core'

import { icon as iconTemplate } from '../templates'
import { mdiSend, mdiKey, mdiClose } from '@mdi/js'

import consumer from '../socketConsumer'
import currentUser from '../currentUser'

import LastMessagesModel from '../models/LastMessagesModel'
import ChatRoomJoinedModel from '../models/ChatRoomJoinedModel'
import ChatRoomJoinModel from '../models/ChatRoomJoinModel'
import ChatRoomJoinableModel from '../models/ChatRoomJoinableModel'
import ChatRoomLeaveModel from '../models/ChatRoomLeaveModel'
import ChatRoomNewModel from '../models/ChatRoomNewModel'
import ChatRoomInviteModel from '../models/ChatRoomInviteModel'
import ChatRoomMuteModel from '../models/ChatRoomMuteModel'
import ChatRoomChangePasswordModel from '../models/ChatRoomChangePasswordModel'
import ChatRoomToggleAdminModel from '../models/ChatRoomToggleAdminModel'
import DefyNewModel from '../models/DefyNewModel'
import UserModel from '../models/UserModel'

import css from '../styles/chat'
import UserBlockIsModel from '../models/UserBlockIsModel'
import AsyncMutex from '../AsyncMutex'

const getRoomName = async room => {
  if (room.is_dm_channel) {
    const otherUserId =
      currentUser().id === room.dm_player1_id
        ? room.dm_player2_id
        : room.dm_player1_id
    const otherUser = await new UserModel({ id: otherUserId }).fetch().promise()
    return otherUser.login
  }
  return room.name
}

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

const tooltipTemplate = user => html`
  <div class=${css.tooltip}>
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
      <div>
        <div class=${css.guildAnagram}>
          ${user.guild ? 'Guild ' + user.guild.anagram : ''}
        </div>
        <div class=${css.guildTitle}>${user.guild ? user.guild.name : ''}</div>
        <button
          class=${css.defyButton}
          data-defy-button=${user.id}
          ?disabled=${user.id == currentUser().id}
        >
          Defy
        </button>
      </div>
    </div>
  </div>
`

const template = ({
  tabs,
  currentTabIndex,
  rooms,
  newChannelExpand,
  getUserData,
}) => html`
  <div class=${css.content}>
    <div class=${css.tabs}>
      <div class=${css.infoChat}>
        <img
          class=${css.infoChatImg}
          src="https://img.icons8.com/bubbles/50/000000/question-mark.png"
        />
        <div class=${css.infoChatDiv}>
          <p>
            admin command :<br />
            <br />
            / => command<br />
            {} => mandatory<br />
            [] => optional<br />
            <br />
            /password [mot de passe]<br />
            /mute {login} [min]<br />
            /ban {login} [min]<br />
            /invite {login}<br />
            /admin {login}<br />
          </p>
        </div>
      </div>
      ${tabs.map(
        ({ name, id }, i) =>
          html`
            <button
              class="${css.tab} ${i === currentTabIndex ? css.tabCurrent : ''}"
              id="chat-expand-tab"
              data-index=${i}
            >
              ${name} ${name !== 'World' ? iconTemplate(mdiClose) : ''}
            </button>
          `
      )}
      <button
        class="${css.tab} ${-1 === currentTabIndex ? css.tabCurrent : ''}"
        id="chat-expand-tab"
        data-index="-1"
      >
        +
      </button>
    </div>
    <div class=${css.messages} data-chat-messages>
      ${tabs[currentTabIndex] && tabs[currentTabIndex].state === 'connected'
        ? tabs[currentTabIndex].messages.map(
            message => html`
              <div class=${css.message}>
                <div
                  class=${css.messagePicture}
                  style="background-image: url(${message.avatar_url})"
                ></div>
                <div class=${css.messageRight}>
                  <div
                    class=${css.messageHead}
                    data-chat-expand-link=${message.user_id}
                  >
                    <span class=${css.messageGuildAnagram}>
                      ${
                        message.guild_anagram
                          ? '[' + message.guild_anagram + ']'
                          : null
                      }
                    </span>
                    <a
                      class=${css.messageUser}
                      href=${'/profile/' + message.user_id}
                    >
                      ${message.author_name}
                    </a>
                    <span class=${css.messageDate}>
                      ${dayjs(message.date).fromNow()}
                    </span>
                    <div
                      data-chat-expand-tooltip
                      class=${css.profileTooltip}
                    >
                      ${
                        getUserData(message.user_id)
                          ? tooltipTemplate(getUserData(message.user_id))
                          : ''
                      }
                    </div>
                  </div>
                  <div class=${css.messageContent}>
                    ${message.content}
                  </div>
                </div>
              </div>
          </div>`
          )
        : ''}
      ${tabs[currentTabIndex] && tabs[currentTabIndex].state === 'connecting'
        ? html` <div class=${css.state}>Connecting...</div> `
        : ''}
      ${tabs[currentTabIndex] && tabs[currentTabIndex].state === 'disconnected'
        ? html` <div class=${css.state}>Disconnected!</div> `
        : ''}
      ${tabs[currentTabIndex] && tabs[currentTabIndex].state === 'rejected'
        ? html` <div class=${css.state}>You cannot access that channel!</div> `
        : ''}
      <div
        class=${currentTabIndex === -1 && !newChannelExpand
          ? css.newChannelButton
          : css.hidden}
      >
        <button id="chat-expand-new-channel">New</button>
      </div>
      <form
        class=${currentTabIndex === -1 && newChannelExpand
          ? css.newChannel
          : css.hidden}
        id="chat-expand-create-channel"
      >
        <div class=${css.newChannelClose} id="chat-expand-new-channel">
          ${iconTemplate(mdiClose)}
        </div>
        <span>New chatroom</span>
        <input placeholder="Name" />
        <input placeholder="Password" type="password" />
        <span>
          <input type="checkbox" id="chat-new-chatroom-private-checkbox" />
          <label for="chat-new-chatroom-private-checkbox">Private</label>
        </span>
        <div class=${css.newChannelSubmit}>
          <button type="submit">Submit</button>
        </div>
      </form>
      ${currentTabIndex === -1
        ? rooms.map(
            (room, i) =>
              html`
                <div
                  class="${css.room} ${room.expand ? css.roomExpand : ''}"
                  id="chat-expand-room-expand"
                  data-index=${i}
                >
                  <div class=${css.roomTitle}>
                    <div>${room.name}</div>
                    <div
                      class=${room.protected ||
                      room.is_dm_channel ||
                      room.private ||
                      room.is_game_channel
                        ? css.keyIcon
                        : css.hidden}
                    >
                      ${iconTemplate(mdiKey)}
                    </div>
                  </div>
                  <div class="${!room.expand ? css.hidden : ''}">
                    <form
                      id="chat-expand-join-room"
                      class="${css.joinRoom} ${room.error
                        ? css.joinRoomError
                        : ''}"
                      data-index=${i}
                    >
                      <button type="submit">Join</button>
                      <input
                        class=${room.protected || currentUser().admin
                          ? ''
                          : css.hidden}
                        placeholder="Password"
                        type="password"
                      />
                    </form>
                  </div>
                </div>
              `
          )
        : ''}
    </div>
    <form class=${css.box} id="chat-expand-write">
      <input
        class=${css.boxInner}
        id="chat-expand-input"
        maxlength="512"
        placeholder="Write your message..."
      />
      <button class=${css.boxSend} type="submit">
        ${iconTemplate(mdiSend)}
      </button>
    </form>
  </div>
`

export default class ChatExpandView extends Backbone.View {
  constructor({ ...args }) {
    super({
      events: {
        'submit #chat-expand-write': 'chatSend',
        'click #chat-expand-tab': 'clickTab',
        'click #chat-expand-room-expand': 'clickRoomExpand',
        'click #chat-expand-join-room *': 'stopPropagation',
        'submit #chat-expand-join-room': 'joinRoom',
        'click #chat-expand-new-channel': 'toggleNewChannelExpand',
        'submit #chat-expand-create-channel': 'createChannel',
        'click [data-chat-expand-link]': 'clickUser',
        'mouseenter [data-chat-expand-link]': 'hoverUser',
        'mouseleave [data-chat-expand-link]': 'stopHoverUser',
        'click [data-defy-button]:not(:disabled)': 'defyUser',
      },
      ...args,
    })
    this.currentTabIndex = 0
    this.rooms = []
    this.blockedMap = new Map()
    this.tooltipUserData = new Map()
    this.blockedMutex = new AsyncMutex()
    this.newChannelExpand = false
    this.notificationsChannel = null
    this.updateInterval = null
  }

  reload() {
    if (this.channels) {
      this.channels.forEach(channel => channel.unsubscribe())
      this.channels = null
    }
    if (this.notificationsChannel) {
      this.notificationsChannel.unsubscribe()
      this.notificationsChannel = null
    }
    clearInterval(this.updateInterval)
    this.currentTabIndex = 0
    this.rooms = []
    this.blockedMap = new Map()
    this.tooltipUserData = new Map()
    this.blockedMutex = new AsyncMutex()
    this.newChannelExpand = false
    this.notificationsChannel = null
    this.updateInterval = null
    this.render()
  }

  isBlocked(userId) {
    return this.blockedMutex.withLock(async () => {
      const blocked = this.blockedMap.get(userId)
      if (typeof blocked !== 'undefined') return blocked

      const res = await new UserBlockIsModel({ id: userId }).fetch().promise()
      this.blockedMap.set(userId, res)

      return res
    })
  }

  async render() {
    if (this.loading) return

    const chatMessagesDiv = this.$('[data-chat-messages]')[0]
    const needsScrollDown =
      !chatMessagesDiv ||
      Math.abs(
        chatMessagesDiv.scrollHeight -
          (chatMessagesDiv.scrollTop + chatMessagesDiv.clientHeight)
      ) < 5

    if (!this.channels) {
      this.loading = true
      // default channel
      let tabs = [{ id: 1, name: 'World', messages: [], state: 'connecting' }]

      const { rooms } = await new ChatRoomJoinedModel().fetch().promise()
      tabs.push(...rooms)
      tabs = await Promise.all(
        tabs.map(async room => ({ ...room, name: await getRoomName(room) }))
      )

      this.channels = tabs.map(tab =>
        consumer.subscriptions.create(
          { channel: 'ChatChannel', room_id: tab.id },
          {
            received: async data => {
              if (data.end_of_channel) {
                await this.quit(tab.id)
                this.render()
              } else {
                if (!(await this.isBlocked(data.user_id)))
                  tab.messages.push(data)
                await this.render()
              }
            },
            rejected: () => {
              tab.state = 'rejected'
              this.render()
            },
            disconnected: () => {
              tab.state = 'disconnected'
              this.render()
            },
            connected: () => {
              tab.state = 'connected'
              this.render()
            },
          }
        )
      )

      await Promise.all(
        tabs.map(tab =>
          new LastMessagesModel({ id: tab.id })
            .fetch()
            .promise()
            .then(
              async r =>
                (tab.messages = (
                  await Promise.all(
                    r.messages.map(async msg => [
                      msg,
                      await this.isBlocked(msg.user_id),
                    ])
                  )
                )
                  .filter(([_, blocked]) => !blocked)
                  .map(([msg]) => msg))
            )
        )
      )

      this.tabs = tabs
    }

    if (!this.notificationsChannel)
      this.notificationsChannel = consumer.subscriptions.create(
        'NotificationsChannel',
        {
          received: async data => {
            const refresh = () => {
              if (this.channels) {
                this.channels.forEach(channel => channel.unsubscribe())
                this.channels = null
              }
              this.render()
            }

            if (data.notification === 'direct_message') {
              this.join(data.room.id)
            } else if (data.notification === 'chat_room_invite') {
              this.join(data.room.id)
            } else if (data.notification === 'block_refresh') {
              this.blockedMap.clear()
              refresh()
            } else if (data.notification === 'game_channel_open') {
              this.join(data.room.id)
            } else if (data.notification === 'you_are_banned_room') {
              this.quit(data.room.id)
            }
          },
        }
      )

    this.loading = false

    render(
      template({
        tabs: this.tabs,
        currentTabIndex: this.currentTabIndex,
        rooms: this.rooms,
        newChannelExpand: this.newChannelExpand,
        getUserData: id => this.tooltipUserData.get(id),
      }),
      this.el
    )

    if (!this.updateInterval)
      this.updateInterval = setInterval(() => this.render(), 3000)

    needsScrollDown &&
      window.requestAnimationFrame(() => {
        const chatMessagesDiv = this.$('[data-chat-messages]')[0]
        chatMessagesDiv.scroll({ top: chatMessagesDiv.scrollHeight })
      })
  }

  remove() {
    this.channels.forEach(channel => channel.unsubscribe())
    this.channels = null
    if (this.notificationsChannel) {
      this.notificationsChannel.unsubscribe()
      this.notificationsChannel = null
    }
    clearInterval(this.updateInterval)
    super.undelegateEvents()
  }

  async chatSend(ev) {
    ev.preventDefault()
    const input = this.$('#chat-expand-input')
    let commandOk = false

    if (input.val().startsWith('/')) {
      const inviteMatch = /^\/invite ([^ ]+)/.exec(input.val())
      if (inviteMatch) {
        try {
          await new ChatRoomInviteModel({
            login: inviteMatch[1],
            room_id: this.tabs[this.currentTabIndex].id,
          })
            .save()
            .promise()

          commandOk = true
        } catch (e) {
          /* ignore */
        }
      }

      const changePasswordMatch = /^\/password(?: ([^ ]*))?/.exec(input.val())
      if (changePasswordMatch) {
        try {
          await new ChatRoomChangePasswordModel({
            password: changePasswordMatch[1],
            room_id: this.tabs[this.currentTabIndex].id,
          })
            .save()
            .promise()

          commandOk = true
        } catch (e) {
          /* ignore */
        }
      }

      const toggleAdminMatch = /^\/admin ([^ ]+)/.exec(input.val())
      if (toggleAdminMatch) {
        try {
          await new ChatRoomToggleAdminModel({
            login: toggleAdminMatch[1],
            room_id: this.tabs[this.currentTabIndex].id,
          })
            .save()
            .promise()

          commandOk = true
        } catch (e) {
          /* ignore */
        }
      }

      const muteBanMatch = /^\/(mute|ban) ([^ ]+)(?: (\d*))?/.exec(input.val())
      if (muteBanMatch) {
        try {
          muteBanMatch[3]
            ? dayjs()
                .add(+muteBanMatch[3], 'minute')
                .toISOString()
            : null
          await new ChatRoomMuteModel({
            room_id: this.tabs[this.currentTabIndex].id,
            ban: muteBanMatch[1] === 'ban',
            login: muteBanMatch[2],
            end: muteBanMatch[3]
              ? dayjs()
                  .add(+muteBanMatch[3], 'minute')
                  .toISOString()
              : null,
          })
            .save()
            .promise()

          commandOk = true
        } catch (e) {
          /* ignore */
        }
      }
    }

    if (!commandOk && input.val().length > 0)
      this.channels[this.currentTabIndex].send({ content: input.val() })
    input.val('')
  }

  async clickTab(ev) {
    const index = parseInt(ev.currentTarget.getAttribute('data-index'))
    if (!ev.target.id) {
      // close button was clicked
      this.quit(this.tabs[index].id)
    } else {
      this.currentTabIndex = index
    }

    try {
      if (index == -1) {
        const { rooms } = await new ChatRoomJoinableModel().fetch().promise()
        this.rooms = rooms.filter(
          ({ id }) => !this.tabs.find(tab => id === tab.id)
        )
      }
    } catch (e) {
      console.log(e)
    }

    this.render()
    if (this.currentTabIndex >= 0) this.$('#chat-expand-input').focus()
  }

  clickRoomExpand(ev) {
    const index = parseInt(ev.currentTarget.getAttribute('data-index'))
    const room = this.rooms[index]
    room.expand = !room.expand
    this.render()
  }

  stopPropagation(ev) {
    ev.stopPropagation()
  }

  async joinRoom(ev) {
    ev.preventDefault()
    const index = parseInt(ev.currentTarget.getAttribute('data-index'))
    const room = this.rooms[index]
    const passwordInput = this.$(ev.currentTarget).find('input')
    const password = passwordInput.val()
    passwordInput.val('')

    try {
      this.join(room.id, password)
    } catch (e) {
      console.error(e)
      room.error = true
    }
    this.render()
    this.$('#chat-expand-input').focus()
  }

  async join(id, password = null) {
    if (this.tabs.some(room => id == room.id)) return

    try {
      await new ChatRoomJoinModel({
        id,
        password,
      })
        .save()
        .promise()
    } catch (e) {
      console.log(e)
    }
    if (this.channels) {
      this.channels.forEach(channel => channel.unsubscribe())
      this.channels = null
    }
    this.currentTabIndex = this.tabs.length
    this.render()
  }

  async quit(id) {
    if (!this.tabs.some(room => id == room.id)) return

    try {
      await new ChatRoomLeaveModel({ id }).save().promise()
    } catch (e) {}
    this.currentTabIndex = 0
    if (this.channels) {
      this.channels.forEach(channel => channel.unsubscribe())
      this.channels = null
    }
    this.render()
  }

  toggleNewChannelExpand() {
    this.newChannelExpand = !this.newChannelExpand
    this.render()
  }

  async createChannel(ev) {
    ev.preventDefault()
    const [nameInput, passwordInput, checkboxInput] = this.$(
      '#chat-expand-create-channel input'
    )
    const name = this.$(nameInput).val()
    const password = this.$(passwordInput).val() || null
    const priv = this.$(checkboxInput).prop('checked')
    try {
      await new ChatRoomNewModel({ name, password, private: priv })
        .save()
        .promise()
    } catch (e) {
      console.log(e)
    }
    if (this.channels) {
      this.channels.forEach(channel => channel.unsubscribe())
      this.channels = null
    }
    this.currentTabIndex = this.tabs.length
    this.newChannelExpand = false
    this.render()
    this.$(nameInput).val('')
    this.$(passwordInput).val('')
  }

  async hoverUser(event) {
    const userId = parseInt(
      event.currentTarget.getAttribute('data-chat-expand-link')
    )

    const popperEl = event.currentTarget.querySelector(
      '[data-chat-expand-tooltip]'
    )
    popperEl.setAttribute('data-show', '')

    if (!this.tooltipUserData.get(userId)) {
      this.tooltipUserData.set(
        userId,
        await new UserModel({ id: userId }).fetch().promise()
      )
      await this.render()
    }

    createPopper(event.currentTarget, popperEl)
  }

  stopHoverUser(event) {
    const userId = parseInt(
      event.currentTarget.getAttribute('data-chat-expand-link')
    )

    const popperEl = event.currentTarget.querySelector(
      '[data-chat-expand-tooltip]'
    )

    this.tooltipUserData.delete(userId)

    popperEl.removeAttribute('data-show')

    createPopper(event.currentTarget, popperEl)
  }

  async defyUser(event) {
    const userId = parseInt(
      event.currentTarget.getAttribute('data-defy-button')
    )

    await new DefyNewModel({ user_id: userId }).save().promise()
  }
}
