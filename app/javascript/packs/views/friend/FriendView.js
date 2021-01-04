import Backbone from 'backbone'
import { html, render } from 'lit-html'

import { icon as iconTemplate } from '../../templates'
import {
  mdiClose,
  mdiTrophy,
  mdiTrophyBroken,
  mdiPodium,
  mdiAccountGroup,
  mdiMedalOutline
} from '@mdi/js'

import css from '../../styles/content'

import currentUser, { update as updateUser } from '../../currentUser'

import UserModel from '../../models/UserModel'
import FriendAddModel from '../../models/FriendAddModel'
import FriendRemoveModel from '../../models/FriendRemoveModel'

const template = ({ user, friends, friendSelected }) => html`
  <div class=${css.line}>
    <div class=${css.colone}>
	  <div style="padding-top: 20px">
	    <span class=${css.selectData} id="user-element" title=${user.displayname}>${
  user.displayname
}</span>
      </div>
      <div style="padding-top: 20px">
        <button class=${css.contentButton} id="friend-new">new</button>
        <input id="friend-name-new" value="" />
      </div>
      <div class=${css.divError} id="divError"></div>
	</div>
    <div class=${css.colone}>
      <input id="search-friend" value="" />
	  <div style=${friendSelected ? '' : 'display :none'}>
	    <p style="font-weight: bold">${
        friendSelected ? friendSelected.displayname : ''
      }</p>
	    <p><span title="rank">${iconTemplate(mdiPodium)}</span>:
		${friendSelected ? friendSelected.rank : ''}</p>
	    <p><span title="points">${iconTemplate(mdiMedalOutline)}</span>:
		${friendSelected ? friendSelected.points : ''}</p>
	    <p><span title="victory">${iconTemplate(mdiTrophy)}<span>:
		${friendSelected ? friendSelected.win : ''}</p>
	    <p><span title="loss">${iconTemplate(mdiTrophyBroken)}</span>:
		${friendSelected ? friendSelected.loss : ''}</p>
	    <p style=${
        friendSelected && friendSelected.guild_id ? '' : 'display :none'
      }>
		<span title="guild">${iconTemplate(mdiAccountGroup)}</span>:
		${friendSelected ? friendSelected.guild_anagram : ''}</p>
	    <table class=${css.guildsRank}
	    style=${
        friendSelected &&
        friendSelected.match_history &&
        friendSelected.match_history.length
          ? ''
          : 'display :none'
      }>
	      <tr class=${css.guildsRankColone}>
	        <td>Enemy</td>
	        <td>Points</td>
	      </tr>
	      ${
          friendSelected && friendSelected.match_history
            ? friendSelected.match_history.map(
                match => html`
                  <tr
                    class=${css.guildsTabElement}
                    style=${match.win ? 'color: green' : 'color: red'}
                  >
                    <td>
                      <span
                        class=${css.pointInfo}
                        id="friend-element"
                        title=${match.enemy}
                      >
                        ${match.enemy}</span
                      >
                    </td>
                    <td>${match.points}</td>
                  </tr>
                `
              )
            : ''
        }
	    </table>
	  </div>
	</div>
    <div class=${css.colone} style="background-color: #252e38;">
      <table class=${css.friendTable}>
        <tr class=${css.guildsRankColone}>
          <td></td>
          <td>Name</td>
          <td>Rank</td>
          <td>Points</td>
          <td>Guild</td>
        </tr>
        ${friends.map(
          friend => html`
            <tr
              class=${friend.status == "in_game" ? css.friendInCombat : css.friend}
              id="friend-element"
              title=${friend.displayname}
            >
              <td>
                <div
                  class=${css.userPicture}
                  style="background-image: url(${friend.avatar_url})"
                ></div>
              </td>
              <td
                class=${friend.status == "offline"
                  ? css.friendOffline
                  : css.friendOnline}
              >
                ${friend.displayname}
              </td>
              <td>${friend.rank}</td>
              <td>${friend.points}</td>
              <td>${friend.guild_anagram}</td>
              <td>
                <button
                  class=${css.friendDeleteFriend}
                  id="friend-delete"
                  title=${friend.displayname}
                >
                  ${iconTemplate(mdiClose)}
                </button>
              </td>
            </tr>
          `
        )}
      </table>
	</div>
  </div>
`

export default class ContentFriendView extends Backbone.View {
  constructor(args = {}) {
    super({
      events: {
        'click button#friend-delete': 'friendDelete',
        'click button#friend-new': 'friendNew',
        'click #friend-element': 'friendSelect',
        'click #user-element': 'userSelect',
        keyup: 'keyaction'
      },
      ...args
    })
    this.name = 'Friends'
    this.friendSelected = false
    this.friends = null
    this.render()
  }
  remove() {
    this.undelegateEvents()
  }
  async render() {
    if (!this.friends) {
      this.friends = (await Promise.all(
        currentUser().friends_id.map(id =>
          new UserModel({ id }).fetch().promise()
        )
      )).sort((a, b) => a.login.localeCompare(b.login))
    }

    render(
      template({
        user: currentUser(),
        friends: this.friends,
        friendSelected: this.friendSelected
      }),
      this.el
    )
  }
  async friendDelete(e) {
    const idx = this.friends.findIndex(user => {
      return (
        user.displayname == e.currentTarget.title ||
        user.login == e.currentTarget.title
      )
    })

    if (idx == -1) {
      this.render()
      return
    }
    if (
      this.friendSelected &&
      this.friends[idx].login == this.friendSelected.login
    )
      this.friendSelected = false
    await new FriendRemoveModel({ login: this.friends[idx].login })
      .save()
      .promise()
    await updateUser(true)
    this.friends = null
    this.render()
  }
  async friendNew() {
    const name = document.getElementById('friend-name-new').value
    const error = document.getElementById('divError')

    error.style.display = 'none'

    if (name == '') {
      error.innerHTML = 'Please enter a name to add friend'
      error.style.display = 'block'
      return
    }
    document.getElementById('friend-name-new').value = ''
    if (name == currentUser().displayname || name == currentUser().login) {
      error.innerHTML = "You can't add yourself as a friend"
      error.style.display = 'block'
      return
    }

    const users = await new UserModel().fetch().promise()

    if (
      users.filter(user => user.displayname == name).length == 0 &&
      users.filter(user => user.login == name).length == 0
    ) {
      error.innerHTML = 'Sorry this user is not in the data base'
      error.style.display = 'block'
      return
    }

    await new FriendAddModel({ login: name, displayname: name }).save().promise()
    this.friends = null
    await updateUser(true)
    this.render()
  }
  async friendSelect(e, value) {
    let idx = -1

    if (!this.friends) return

    if (!value)
      idx = this.friends.findIndex(friend => {
        return (
          friend.displayname == e.currentTarget.title ||
          friend.login == e.currentTarget.title
        )
      })
    else
      idx = this.friends.findIndex(friend => {
        return friend.displayname == value || friend.login == value
      })

    if (idx != -1) this.friendSelected = this.friends[idx]
    this.friends = null
    await updateUser()
    this.render()
  }
  async userSelect() {
    this.friendSelected = currentUser()
    this.friends = null
    await updateUser()
    this.render()
  }
  keyaction(e) {
    const code = e.keyCode || e.witch
    if (e.target.id == 'search-friend' && code == 13) {
      if (currentUser().login == e.target.value) this.userSelect()
      else this.friendSelect(e, e.target.value)
      e.target.value = ''
    }
    if (e.target.id == 'friend-name-new' && code == 13) {
      this.friendNew()
    }
  }
}
