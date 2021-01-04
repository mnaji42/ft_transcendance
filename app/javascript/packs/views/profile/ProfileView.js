import { View } from 'backbone'
import { html, render } from 'lit-html'
import dayjs from 'dayjs'

import css from '../../styles/profile'
import UserModel from '../../models/UserModel'
import MatchHistoryModel from '../../models/MatchHistoryModel'
import DirectMessageModel from '../../models/DirectMessageModel'
import UserBlockIsModel from '../../models/UserBlockIsModel'
import UserBlockAddModel from '../../models/UserBlockAddModel'
import UserBlockRemoveModel from '../../models/UserBlockRemoveModel'
import FriendAddModel from '../../models/FriendAddModel'
import FriendRemoveModel from '../../models/FriendRemoveModel'
import DefyNewModel from '../../models/DefyNewModel'
import currentUser, { update as updateUser } from '../../currentUser'
import AsyncMutex from '../../AsyncMutex'

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

const matchTypeColorClass = type => {
  if (type === 'training') return css.matchTypeTraining
  if (type === 'tournament') return css.matchTypeTournament
  if (type === 'ranked') return css.matchTypeRanked
  if (type === 'war') return css.matchTypeWar
  if (type === 'duel') return css.matchTypeDuel
}

const matchHistoryTemplate = ({ matchHistory }) => {
  if (!matchHistory.length)
    return html`
      <div class=${css.noMatch}>No match</div>
    `
  return matchHistory.map(
    ({
      versusDisplay,
      versusLogin,
      type,
      won,
      score,
      versusScore,
      date,
      versusId
    }) => html`
      <div class=${css.match}>
        <span class=${css.matchDate}>
          ${dayjs(date).format('YYYY/MM/DD HH:mm')} -
        </span>
        <span class=${css.matchWin}>${won ? 'Won' : 'Lost'}</span>
        <span class=${css.matchScore}>${score}-${versusScore}</span>
        versus
        <a href=${'/profile/' + versusId}>
          <span class=${css.matchVersusDisplay}>${versusDisplay}</span>
          <span class=${css.matchVersusLogin}>${versusLogin}</span>
        </a>
        in a
        <span class="${css.matchType} ${matchTypeColorClass(type)}">
          ${type}
        </span>
        match.
      </div>
    `
  )
}

const template = ({ user, matchHistory, blocked }) => html`
  <div class=${css.content}>
    <div class=${css.contentInner}>
      <div class=${css.firstLine}>
        <div
          class=${css.avatar}
          style="background-image: url(${user.avatar_url})"
        >
          <div class="${css.statusBubble} ${statusClass(user.status)}"></div>
        </div>
        <div class=${css.titleCardAndButtons}>
          <div class=${css.titleCard}>
            <div class=${css.title}>
              ${user.displayname}
              <span class=${css.login}>${user.login}</span>
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
                <div class=${css.guildTitle}>
                  ${user.guild ? user.guild.name : ''}
                </div>
              </div>
            </div>
          </div>
          <div class=${css.rightButtons}>
            <button
              class=${css.buttonBlock}
              data-profile-block
              ?disabled=${currentUser().id == user.id}
            >
              ${blocked ? 'Unblock' : 'Block'}
            </button>
            <button
              class=${css.buttonAddFriend}
              data-profile-add-friend
              ?disabled=${currentUser().id == user.id}
            >
              ${currentUser().friends_id.includes(user.id)
                ? 'Remove friend'
                : 'Add friend'}
            </button>
            <button
              class=${css.buttonDefy}
              data-profile-defy
              ?disabled=${currentUser().id == user.id ||
                user.status !== 'online'}
            >
              Defy
            </button>
            <button
              class=${css.buttonSpectate}
              data-profile-spectate
              ?disabled=${currentUser().id == user.id ||
                user.status !== 'in_game'}
            >
              Spectate
            </button>
            <button
              class=${css.buttonDirectMessage}
              data-profile-direct-message
              ?disabled=${currentUser().id == user.id}
            >
              Direct message
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class=${css.matchHistory}>
      <div class=${css.matchHistoryTitle}>Match history</div>
      <div class=${css.matchHistoryCtnr}>
        ${matchHistoryTemplate({ matchHistory })}
      </div>
    </div>
  </div>
`

export default class ProfileView extends View {
  constructor({ id, ...args } = {}) {
    super({
      // prettier-ignore
      events: {
        'click [data-profile-block]:not(:disabled)': 'buttonBlock',
        'click [data-profile-add-friend]:not(:disabled)': 'buttonAddFriend',
        'click [data-profile-direct-message]:not(:disabled)': 'buttonDirectMessages',
        'click [data-profile-defy]:not(:disabled)': 'buttonDefy',
        'click [data-profile-spectate]:not(:disabled)': 'buttonSpectate',
      },
      ...args
    })
    this.id = id
    this.user = null
    this.matchHistory = null
    this.blocked = null
  }
  async getMatchHistory(id) {
    const raw = await new MatchHistoryModel({ id }).fetch().promise()
    const map = new Map()
    const mutex = new AsyncMutex()

    const getPlayer = id =>
      mutex.withLock(async () => {
        const ret = map.get(id)
        if (ret) return ret

        const entry = await new UserModel({ id }).fetch().promise()
        map.set(id, entry)
        if (id === currentUser().id) return { status: 'online', ...entry }
        return entry
      })

    return await Promise.all(
      raw.map(
        async ({
          player1_id,
          player2_id,
          player1_score,
          player2_score,
          game_mode,
          finish_date
        }) => {
          const otherPlayerId = player1_id == id ? player2_id : player1_id
          const otherPlayer = await getPlayer(otherPlayerId)
          const isWinner =
            id == player1_id
              ? player1_score > player2_score
              : player2_score > player1_score

          const score = id == player1_id ? player1_score : player2_score
          const otherScore = id == player1_id ? player2_score : player1_score

          return {
            versusDisplay: otherPlayer.displayname,
            versusLogin: otherPlayer.login,
            type: game_mode,
            won: isWinner,
            score,
            versusScore: otherScore,
            date: finish_date,
            versusId: otherPlayerId
          }
        }
      )
    )
  }
  async render() {
    if (!this.user)
      this.user = await new UserModel({ id: this.id }).fetch().promise()

    if (this.user.id === currentUser().id) this.user.status = 'online'
    if (!this.matchHistory)
      this.matchHistory = await this.getMatchHistory(this.id)
    if (this.blocked === null)
      this.blocked = await new UserBlockIsModel({ id: this.id })
        .fetch()
        .promise()

    render(
      template({
        user: this.user,
        matchHistory: this.matchHistory,
        blocked: this.blocked
      }),
      this.el
    )
  }
  remove() {
    this.undelegateEvents()
  }

  async buttonDirectMessages() {
    await new DirectMessageModel({ user_id: this.id }).save().promise()
  }

  async buttonAddFriend() {
    const Model = currentUser().friends_id.includes(this.user.id)
      ? FriendRemoveModel
      : FriendAddModel
    await new Model({ login: this.user.login }).save().promise()
    await updateUser(true)
    this.render()
  }

  async buttonBlock() {
    if (this.blocked) {
      await new UserBlockRemoveModel({ user_id: this.id }).save().promise()
    } else {
      await new UserBlockAddModel({ user_id: this.id }).save().promise()
    }
    this.blocked = null
    this.render()
  }

  async buttonDefy() {
    await new DefyNewModel({ user_id: this.id }).save().promise()
  }

  buttonSpectate() {
    this.trigger('spectate', this.user.current_game_id)
  }
}
