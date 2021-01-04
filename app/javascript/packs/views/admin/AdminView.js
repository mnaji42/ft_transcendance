import Backbone from 'backbone'
import { html, render } from 'lit-html'

import { icon as iconTemplate } from '../../templates'
import { mdiSend } from '@mdi/js'

import css from '../../styles/content'

import UserModel from '../../models/UserModel'
import TournamentModel from '../../models/TournamentModel'
import GuildModel from '../../models/GuildModel'

import dayjs from 'dayjs'
import WarModel from '../../models/WarModel'
import AdminChatJoinModel from '../../models/AdminChatJoinModel'
import AdminChatDeleteModel from '../../models/AdminChatDeleteModel'
import AdminUserBanModel from '../../models/AdminUserBanModel'
import AdminChatDemoteModel from '../../models/AdminChatDemoteModel'
import AdminChatPromoteModel from '../../models/AdminChatPromoteModel'
import GuildBanMemberModel from '../../models/GuildBanMemberModel'
import ChatRoomJoinableModel from '../../models/ChatRoomJoinableModel'

function uncheck(id) {
  document.getElementById(id).checked = false
}
function uncheckSubSlide() {
  document.getElementById('radioOffLine').checked = false
  document.getElementById('radioRandom').checked = false
  document.getElementById('radioFriend').checked = false
  document.getElementById('radioWar').checked = false
}

const template = ({ user, users, tournaments, guildMembers, admins }) => html`
  <div class=${css.line}>
    <div
      id="coloneAdmin"
      class=${css.colone}
      style=${'width: 66.68%;position:relative'}
    >
      <section class=${css.cnContainer} id="chooseSlide">
        ${[
          ['TournamentCreate'],
          ['TournamentDelete'],
          ['ChatSearch'],
          ['ChatDelete'],
          ['UserBan'],
          ['UserBanFromChat'],
          ['UserRemoveRightGuild'],
          ['UserAddAdmin']
        ].map(
          chaine => html`
            <input
              class=${css['radio' + chaine[0]]}
              type="radio"
              style="display: none"
              id=${'radio' + chaine[0]}
              name="slideAdmin"
              value=${chaine[0].toLowerCase()}
            />
          `
        )}
        <input
          class=${css.radioDeleteUnchecked}
          type="radio"
          style="display: none"
          id="radioDeleteUnchecked"
          name="tournamentDelete"
          value="unchecked"
          checked
        />
        ${tournaments.map(
          tournament => html`
            <input
              class=${css['radioDeleteSpecial' + tournament.id_array]}
              type="radio"
              style="display: none"
              id=${'radioDeleteSpecial' + tournament.id_array}
              name=${'tournamentDelete'}
              value=${tournament.id}
            />
          `
        )}
        ${[
          ['MaxScore5', 'maxScore', '5'],
          ['BonusDefault', 'chooseBonus', 'bonusDefault']
        ].map(
          chaine => html`
            <input
              class=${css['radio' + chaine[0]]}
              style="display: none"
              type="radio"
              id=${'radio' + chaine[0]}
              name=${chaine[1]}
              value=${chaine[2]}
              checked="checked"
            />
          `
        )}
        ${[
          ['MaxScore1', 'maxScore', '1'],
          ['MaxScore2', 'maxScore', '2'],
          ['MaxScore3', 'maxScore', '3'],
          ['MaxScore4', 'maxScore', '4'],
          ['MaxScore6', 'maxScore', '6'],
          ['MaxScore7', 'maxScore', '7'],
          ['MaxScore8', 'maxScore', '8'],
          ['MaxScore9', 'maxScore', '9'],
          ['MaxScore10', 'maxScore', '10'],
          ['BonusBarrier', 'chooseBonus', 'bonusBarrier'],
          ['BonusDoubleBall', 'chooseBonus', 'bonusDoubleBall']
        ].map(
          chaine => html`
            <input
              class=${css['radio' + chaine[0]]}
              style="display: none"
              type="radio"
              id=${'radio' + chaine[0]}
              name=${chaine[1]}
              value=${chaine[2]}
            />
          `
        )}
        <div class=${css.chooseSlide}>
          <nav>
            <h3>Tournaments</h3>
            <label for="radioTournamentCreate" class=${css.labelSubSlideAdmin}
              >Create</label
            >
            <label for="radioTournamentDelete" class=${css.labelSubSlideAdmin}
              >Delete</label
            >
          </nav>
          <nav>
            <h3>Chat</h3>
            <label for="radioChatSearch" class=${css.labelSubSlideAdmin}
              >Join</label
            >
            <label for="radioChatDelete" class=${css.labelSubSlideAdmin}
              >Delete</label
            >
          </nav>
          <nav>
            <h3>Users</h3>
            <label for="radioUserBan" class=${css.labelSubSlideAdmin}
              >Ban user</label
            >
            <label for="radioUserBanFromChat" class=${css.labelSubSlideAdmin}
              >Chat rights</label
            >
            <label
              for="radioUserRemoveRightGuild"
              class=${css.labelSubSlideAdmin}
              >Guild rights</label
            >
            <label for="radioUserAddAdmin" class=${css.labelSubSlideAdmin}
              >Admin rights</label
            >
          </nav>
        </div>
        <div class=${css.slideSettingsAdmin}>
          <h2>Settings</h2>
          <a id="cnBackSettings" class=${css.cnBack}
            ><img src="https://img.icons8.com/android/50/000000/left2.png"
          /></a>
          <div class=${css.cnContent}>
            <div class=${css.deleteTournamentList}>
              <h3>Special tournament</h3>
              <p>
                ${tournaments.map(
                  tournament =>
                    html`
                      <label
                        class=${css['labelDeleteSpecial' + tournament.id_array]}
                        for=${'radioDeleteSpecial' + tournament.id_array}
                        style=${tournament.id_array == 0 ? 'display :none' : ''}
                        >${tournament.name}</label
                      >
                    `
                )}
              </p>
            </div>
            ${tournaments.map(
              tournament =>
                html`
                  <div class=${css['rulesTournament' + tournament.id_array]}>
                    <h3>Rules</h3>
                    <p style=${tournament.id_array == 0 ? 'display :none' : ''}>
                      Start :
                      ${dayjs(tournament.start_date).format('DD/MM/YYYY HH:mm')}
                    </p>
                    <p style=${tournament.id_array == 0 ? 'display :none' : ''}>
                      End :
                      ${dayjs(tournament.end_date).format('DD/MM/YYYY HH:mm')}
                    </p>
                    <p>Max score : ${tournament.max_score}</p>
                    <p>Bonus : ${tournament.bonus.slice(5)}</p>
                  </div>
                `
            )}
            <div class=${css.chooseNameTournament}>
              <h3>Choose the name of the tournament</h3>
              <p>
                <input
                  class=${css.labelName}
                  type="text"
                  placeholder="Name..."
                  id="tournamentName"
                />
              </p>
            </div>
            <div class=${css.chooseDate}>
              <h3>Choose the date of the tournament</h3>
              <p>
                Begin :
                <input id="dateCreateTournamentBegin" type="datetime-local" />
              </p>
              <p>
                End :
                <input id="dateCreateTournamentEnd" type="datetime-local" />
              </p>
            </div>
            <div class=${css.maxScore}>
              <h3>Choose the number of points to win</h3>
              <p>
                ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(
                  chaine =>
                    html`
                      <label
                        class=${css['labelMaxScore' + chaine]}
                        for=${'radioMaxScore' + chaine}
                        >${chaine}</label
                      >
                    `
                )}
              </p>
            </div>
            <div class=${css.chooseBonus}>
              <h3>Choose the bonus</h3>
              <p>
                <label class=${css.labelBonusDefault} for="radioBonusDefault"
                  >Default</label
                >
                <label class=${css.labelBonusBarrier} for="radioBonusBarrier"
                  >Barrier</label
                >
                <label
                  class=${css.labelBonusDoubleBall}
                  for="radioBonusDoubleBall"
                  >Double Ball</label
                >
              </p>
            </div>
            <div class=${css.chooseUser}>
              <h3>Name of the user</h3>
              <p>
                <input
                  class=${css.labelFriend}
                  type="text"
                  placeholder="Name of the user..."
                  id="nameOfUser"
                />
              </p>
            </div>
            <div class=${css.chooseChatChannel}>
              <h3>Name of the chat channel</h3>
              <p>
                <input
                  class=${css.labelFriend}
                  type="text"
                  placeholder="Name of the chat channel..."
                  id="nameOfChatChannel"
                />
              </p>
            </div>
            <div class=${css.chooseGuild}>
              <h3>Name of the guild</h3>
              <p>
                <input
                  class=${css.labelFriend}
                  type="text"
                  placeholder="Name of the guild..."
                  id="nameOfGuild"
                />
                <button class=${css.buttonStart} id="searchGuildAdmin" }>
                  Search
                </button>
              </p>
              <p id="displayErrorGuild" class=${css.displayError}></p>
            </div>
            <div id="chooseUsersGuild" style="display:none">
              <h3>Users of the guild</h3>
              ${guildMembers.map(
                usr =>
                  html`
                    <p>
                      <span
                        style=${usr.grade == 'owner' || usr.grade == 'officer'
                          ? usr.grade == 'owner'
                            ? 'font-size:23px;color: red'
                            : 'font-size:23px;color: orange'
                          : 'font-size:23px;color: black'}
                      >
                        ${usr.displayname}
                      </span>
                      ${['Give', 'Remove', 'Ban', 'Owner'].map(
                        chaine => html`
                          <button
                            style=${usr.grade == 'owner' ||
                            (usr.grade == 'officer' && chaine == 'Give') ||
                            (usr.grade == '' && chaine == 'Remove')
                              ? 'display:none'
                              : ''}
                            class=${css.buttonUsersGuild}
                            id=${'GuildRightsAdmin' + chaine}
                            data-usrid=${usr.id}
                          >
                            ${chaine}
                          </button>
                        `
                      )}
                    </p>
                  `
              )}
            </div>
            <div
              class=${css.buttonValidateSettings}
              id="buttonValidateSettings"
            >
              <p id="displayError" class=${css.displayError}></p>
              ${[
                ['DeleteTournament', 'Delete'],
                ['CreateTournament', 'Create'],
                ['JoinChatAdmin', 'Join'],
                ['DeleteChatAdmin', 'Delete'],
                ['BanUserAdmin', 'Ban'],
                ['DeleteGuildAdmin', 'Delete']
              ].map(
                chaine => html`
                  <p class=${css['button' + chaine[0]]}>
                    <button class=${css.buttonStart} id=${chaine[0]}>
                      ${chaine[1]}
                    </button>
                  </p>
                `
              )}
              <p class=${css.buttonRightsAdmin}>
                <button class=${css.buttonStart} id="AddAdmin" }>Add</button>
                <button class=${css.buttonStart} id="RemoveAdmin" }>
                  Remove
                </button>
              </p>
              <p class=${css.buttonChatRightsAdmin}>
                <button class=${css.buttonStart} id="ChatRightsAdminRemove" }>
                  Remove
                </button>
                <button class=${css.buttonStart} id="ChatRightsAdminGive" }>
                  Give
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class=${css.colone} style=${'width: 0px'}></div>
    <div class=${css.colone} style="background-color: #252e38;">
      <table class=${css.friendTable}>
        <tr class=${css.guildsRankColone}>
          <td></td>
          <td>name</td>
        </tr>
        ${admins.map(
          r_user => html`
            <tr class=${css.user} title=${r_user.displayname}>
              <td>
                <div
                  class=${css.userPicture}
                  style="background-image: url(${r_user.avatar_url})"
                ></div>
              </td>
              <td class=${css.friendOnline}>${r_user.displayname}</td>
            </tr>
          `
        )}
      </table>
    </div>
  </div>
`

export default class AdminView extends Backbone.View {
  constructor(args = {}) {
    super({
      events: {
        'click #cnBackSettings': 'cnBackSettings',
        'click button#CreateTournament': 'createTournament',
        'click button#DeleteTournament': 'deleteTournament',
        'click button#JoinChatAdmin': 'joinChatAdmin',
        'click button#DeleteChatAdmin': 'deleteChatAdmin',
        'click button#BanUserAdmin': 'banUserAdmin',
        'click button#ChatRightsAdminRemove': 'chatRightsAdminRemove',
        'click button#ChatRightsAdminGive': 'chatRightsAdminGive',
        'click button#GuildRightsAdminRemove': 'guildRightsAdminRemove',
        'click button#GuildRightsAdminGive': 'guildRightsAdminGive',
        'click button#GuildRightsAdminBan': 'guildRightsAdminBan',
        'click button#GuildRightsAdminOwner': 'guildRightsAdminOwner',
        'click #nameOfGuild': 'inputGuildResearch',
        'click button#AddAdmin': 'addAdmin',
        'click button#RemoveAdmin': 'removeAdmin',
        'click button#searchGuildAdmin': 'searchGuildAdmin',
        'click button#DeleteGuildAdmin': 'DeleteGuildAdmin'
      },
      ...args
    })
    this.users = []
    this.user = args.user
    this.guildMembers = []
    this.name = 'Admin'
  }

  async render() {
    this.tournaments = await new TournamentModel().fetch().promise()
    this.users = await new UserModel().fetch().promise()
    this.admins = this.users.filter(user => user.admin)
    render(
      template({
        user: this.user,
        users: this.users,
        tournaments: this.tournaments,
        guildMembers: this.guildMembers,
        admins: this.admins
      }),
      this.el
    )
  }

  remove() {
    this.undelegateEvents()
  }

  cnBackSettings() {
    document.getElementById('radioTournamentCreate').checked = false
    document.getElementById('radioTournamentDelete').checked = false
    document.getElementById('radioDeleteUnchecked').checked = true
    document.getElementById('radioChatSearch').checked = false
    document.getElementById('radioChatDelete').checked = false
    document.getElementById('radioUserBan').checked = false
    document.getElementById('radioUserBanFromChat').checked = false
    document.getElementById('radioUserRemoveRightGuild').checked = false
    document.getElementById('radioUserAddAdmin').checked = false
    document.getElementById('displayError').style.display = 'none'
    document.getElementById('chooseUsersGuild').style.display = 'none'
    document.getElementById('displayErrorGuild').style.display = 'none'
    // document.getElementById('buttonValidateSettings').style.display = 'none'
    // document.getElementById('buttonGuildRightsAdmin').style.display = 'none'

    this.guildMembers = []
  }

  // nameOfChatChannel
  // nameOfUser
  // nameOfGuild

  async updateGuildView(guild, usrId = null) {
    this.guildMembers = []
    let member
    for (let i = 0; i < guild.members_id.length; i++) {
      member = await new UserModel({ id: guild.members_id[i] }).fetch().done()
      if (usrId == guild.members_id[i]) member.grade = 'officer'
      else if (guild.owner_id == member.id) member.grade = 'owner'
      else if (guild.officers_id.includes(member.id)) member.grade = 'officer'
      else member.grade = ''
      this.guildMembers.push(member)
    }
    this.render()
  }

  inputGuildResearch() {
    // chooseUsersGuild
    document.getElementById('buttonValidateSettings').style.display = 'none'
    document.getElementById('chooseUsersGuild').style.display = 'none'
    var error = document.getElementById('displayErrorGuild')
    error.style.display = 'none'
    this.guildMembers = []
    this.render()
  }

  async searchGuildAdmin() {
    document.getElementById('buttonValidateSettings').style.display = 'none'
    document.getElementById('chooseUsersGuild').style.display = 'none'
    // document.getElementById('buttonGuildRightsAdmin').style.display = 'none'
    var error = document.getElementById('displayErrorGuild')
    error.style.display = 'none'

    let guild = document.getElementById('nameOfGuild').value

    if (guild == '') {
      error.innerHTML = 'Enter a name of guild'
      error.style.display = 'block'
      return
    }
    const guilds = await new GuildModel().fetch().promise()
    guild = guilds.filter(el => el.name == guild)
    if (guild.length == 0) {
      error.innerHTML = 'This guild is not in the data base'
      error.style.display = 'block'
      return
    }
    document.getElementById('buttonValidateSettings').style.display = 'block'
    document.getElementById('chooseUsersGuild').style.display = 'block'

    this.updateGuildView(guild[0])
  }

  async joinChatAdmin() {
    //Cette fonction est sensé permettre a tous les admins de rejoindre nimporte quelle chet

    var error = document.getElementById('displayError')
    error.style.display = 'none'

    const chatName = document.getElementById('nameOfChatChannel').value

    if (chatName == '') {
      error.innerHTML = 'Enter a name of chat channel'
      error.style.display = 'block'
    }

    const chats = await new ChatRoomJoinableModel().fetch().promise()

    const chat = chats.rooms.filter(room => room.name == chatName)

    if (chat.length == 0) {
      error.innerHTML = "This chat doesn't exist"
      error.style.display = 'block'
      return
    }

    //Il faut verifier que le nom du chat est valide
    //On peut aussi verifier qu'il l'a pas deja rejoins

    //Il faut ensuite rejoindre le chat

    await new AdminChatJoinModel({ name: chatName }).save().promise()
    this.trigger('update-chat')
  }
  async deleteChatAdmin() {
    //Cette fonction est sensé permettre a tous les admins de supprimer nimporte quelle chet

    var error = document.getElementById('displayError')
    error.style.display = 'none'

    const chatName = document.getElementById('nameOfChatChannel').value

    if (chatName == '') {
      error.innerHTML = 'Enter a name of chat channel'
      error.style.display = 'block'
    }

    const chats = await new ChatRoomJoinableModel().fetch().promise()

    const chat = chats.rooms.filter(room => room.name == chatName)

    if (chat.length == 0) {
      error.innerHTML = "This chat doesn't exist"
      error.style.display = 'block'
      return
    }

    //Il faut verifier que le nom du chat est valide

    //Il faut ensuite supprimer le chat
    await new AdminChatDeleteModel({ name: chatName }).save().promise()
    this.trigger('update-chat')
  }
  async banUserAdmin() {
    // Cette fonction est sensé permettre de banir un user
    var error = document.getElementById('displayError')
    error.style.display = 'none'

    let usr = document.getElementById('nameOfUser').value
    const name = usr

    if (usr == '') {
      error.innerHTML = 'Enter a name of user'
      error.style.display = 'block'
      return
    }

    usr = this.users.filter(user => user.displayname == name)

    if (usr.length == 0) {
      usr = this.users.filter(user => user.login == name)
    }
    if (usr.length == 0) {
      error.innerHTML = 'This user is not in the data base'
      error.style.display = 'block'
      return
    } else if (usr[0].banned == true) {
      error.innerHTML = 'This user is already banned'
      error.style.display = 'block'
      return
    }

    await new AdminUserBanModel({ displayname: usr[0].displayname })
      .save()
      .promise()
    this.render()
  }
  async chatRightsAdminRemove() {
    // Cette fonstion est sensé supprimer un user d'un chat et lui enlever les droits d'acces

    var error = document.getElementById('displayError')
    error.style.display = 'none'

    const chatName = document.getElementById('nameOfChatChannel').value
    let usr = document.getElementById('nameOfUser').value
    const name = usr

    if (usr == '') {
      error.innerHTML = 'Enter a name of user'
      error.style.display = 'block'
      return
    }

    usr = this.users.filter(user => user.displayname == name)

    if (usr.length == 0) {
      usr = this.users.filter(user => user.login == name)
    }
    if (usr.length == 0) {
      error.innerHTML = 'This user is not in the data base'
      error.style.display = 'block'
      return
    }

    if (chatName == '') {
      error.innerHTML = 'Enter a name of chat'
      error.style.display = 'block'
      return
    }

    const chats = await new ChatRoomJoinableModel().fetch().promise()

    const chat = chats.rooms.filter(room => room.name == chatName)

    if (chat.length == 0) {
      error.innerHTML = "This chat doesn't exist"
      error.style.display = 'block'
      return
    }

    //Il faut verifier que le chat existe
    //On peut aussi verifier qu'on lui avat pas deja enlevé les droits
    // Il faut verifier si le user est bien dans la chatRoom et si il est admin

    try {
      await new AdminChatDemoteModel({
        displayname: usr[0].displayname,
        chat: chatName
      })
        .save()
        .promise()
    } catch (err) {
      error.innerHTML = 'This user is not in this chat channel'
      error.style.display = 'block'
    }
    this.trigger('update-chat')
  }
  async chatRightsAdminGive() {
    // Cette fonstion est sensé rendre le droit d'acces a un user a un chat

    var error = document.getElementById('displayError')
    error.style.display = 'none'

    const chatName = document.getElementById('nameOfChatChannel').value
    let usr = document.getElementById('nameOfUser').value
    const name = usr

    if (usr == '') {
      error.innerHTML = 'Enter a name of user'
      error.style.display = 'block'
      return
    }

    usr = this.users.filter(user => user.displayname == name)

    if (usr.length == 0) {
      usr = this.users.filter(user => user.login == name)
    }
    if (usr.length == 0) {
      error.innerHTML = 'This user is not in the data base'
      error.style.display = 'block'
      return
    }

    if (chatName == '') {
      error.innerHTML = 'Enter a name of chat'
      error.style.display = 'block'
      return
    }

    const chats = await new ChatRoomJoinableModel().fetch().promise()

    const chat = chats.rooms.filter(room => room.name == chatName)

    if (chat.length == 0) {
      error.innerHTML = "This chat doesn't exist"
      error.style.display = 'block'
      return
    }

    //Il faut verifier que le chat existe
    //On peut aussi verifier si il avait pas deja les droits
    try {
      await new AdminChatPromoteModel({
        displayname: usr[0].displayname,
        chat: chatName
      })
        .save()
        .promise()
    } catch (err) {
      error.innerHTML = 'This user is not in this chat channel'
      error.style.display = 'block'
    }
    this.trigger('update-chat')
  }
  async guildRightsAdminRemove(e) {
    // var error = document.getElementById('displayErrorGuild')
    // error.style.display = 'none'

    // // const usr = $(e.currentTarget).data('usrid')
    const usr = e.currentTarget.getAttribute('data-usrid')

    const guilds = await new GuildModel().fetch().promise()
    let guild = guilds.filter(
      el => el.name == document.getElementById('nameOfGuild').value
    )[0]
    guild.officers_id = guild.officers_id.filter(id => id != usr)
    await new GuildModel(guild).save().done(() => {})
    this.updateGuildView(guild)
  }
  async guildRightsAdminGive(e) {
    // var error = document.getElementById('displayErrorGuild')
    // error.style.display = 'none'

    // const usr = $(e.currentTarget).data('usrid')
    const usr = e.currentTarget.getAttribute('data-usrid')

    const guilds = await new GuildModel().fetch().promise()
    let guild = guilds.filter(
      el => el.name == document.getElementById('nameOfGuild').value
    )[0]

    guild.officers_id.push(usr)
    // this.guildMembers[1].grade = 'officer'
    await new GuildModel(guild).save().done(() => {})
    this.updateGuildView(guild, usr)
  }
  async guildRightsAdminBan(e) {
    // var error = document.getElementById('displayErrorGuild')
    // error.style.display = 'none'

    // const usr = $(e.currentTarget).data('usrid')
    const usr = e.currentTarget.getAttribute('data-usrid')

    const guilds = await new GuildModel().fetch().promise()
    let guild = guilds.filter(
      el => el.name == document.getElementById('nameOfGuild').value
    )[0]

    let user = await new UserModel({ id: usr }).fetch().promise()

    await new GuildBanMemberModel({
      guild_id: guild.id,
      displayname: user.displayname
    })
      .save()
      .promise()
    guild.members_id = guild.members_id.filter(usr_id => usr_id != usr)
    this.updateGuildView(guild)
  }
  async guildRightsAdminOwner(e) {
    // var error = document.getElementById('displayErrorGuild')
    // error.style.display = 'none'

    // const usr = $(e.currentTarget).data('usrid')
    const usr = e.currentTarget.getAttribute('data-usrid')

    const guilds = await new GuildModel().fetch().promise()
    let guild = guilds.filter(
      el => el.name == document.getElementById('nameOfGuild').value
    )[0]

    guild.owner_id = usr
    await new GuildModel(guild).save().done(() => {})
    this.updateGuildView(guild)
  }
  async DeleteGuildAdmin() {
    const today = dayjs(new Date())
    const guilds = await new GuildModel().fetch().promise()
    let guild = guilds.filter(
      el => el.name == document.getElementById('nameOfGuild').value
    )[0]
    for (let i = 0; i < guild.members_id.length; i++)
      await new UserModel({
        id: guild.members_id[i],
        guild_id: 0,
        guild_anagram: ''
      }).save()
    let war
    if (guild.actual_war_id) {
      war = await new WarModel({ id: guild.actual_war_id }).fetch().promise()
      guild.actual_war_id = null
      const opponent_id =
        war.guild1_id == guild.id ? war.guild2_id : war.guild1_id
      let opponent = await new GuildModel({ id: opponent_id }).fetch().promise()
      opponent.points += war.prize
      opponent.actual_war_id = null
      opponent.history_wars_id.push(war.id)
      war.winner = guild.name == war.guild1 ? 2 : 1
      war.end = today
      await new GuildModel(opponent).save().done()
      await new WarModel(war).save().done()
    }
    for (let i = 0; i < guild.wars_id.length; i++) {
      war = await new WarModel({ id: guild.wars_id[i] }).fetch().promise()
      const opponent_id =
        war.guild1_id == guild.id ? war.guild2_id : war.guild1_id
      let opponent = await new GuildModel({ id: opponent_id }).fetch().promise()
      opponent.wars_id = opponent.wars_id.filter(id => id != war.id)
      if (war.pending == false) {
        opponent.points += war.prize
        opponent.history_wars_id.push(war.id)
        war.winner = guild.name == war.guild1 ? 2 : 1
        war.end = today
        await new WarModel(war).save().done()
      } else {
        await new WarModel(war).destroy().done()
      }
      await new GuildModel(opponent).save().done()
    }
    await new GuildModel(guild).destroy().done(() => {
      document.getElementById('nameOfGuild').value = ''
      document.getElementById('buttonValidateSettings').style.display = 'none'
      document.getElementById('chooseUsersGuild').style.display = 'none'
      this.render()
    })
  }
  async addAdmin() {
    var error = document.getElementById('displayError')
    error.style.display = 'none'

    let usr = document.getElementById('nameOfUser').value
    const name = usr

    if (usr == '') {
      error.innerHTML = 'Enter a name of user'
      error.style.display = 'block'
      return
    }

    usr = this.users.filter(user => user.displayname == name)

    if (usr.length == 0) {
      usr = this.users.filter(user => user.login == name)
    }

    if (usr.length == 0) {
      error.innerHTML = 'This user is not in the data base'
      error.style.display = 'block'
    } else if (usr[0].admin == true) {
      error.innerHTML = 'This user is already admin'
      error.style.display = 'block'
    } else {
      let user = await new UserModel({ id: usr[0].id }).fetch().promise()

      user.admin = true
      await new UserModel(user).save().done(() => {
        this.render()
      })
    }
  }
  async removeAdmin() {
    var error = document.getElementById('displayError')
    error.style.display = 'none'

    let usr = document.getElementById('nameOfUser').value
    const name = usr

    if (usr == '') {
      error.innerHTML = 'Enter a name of user'
      error.style.display = 'block'
      return
    }

    usr = this.users.filter(user => user.displayname == name)

    if (usr.length == 0) {
      usr = this.users.filter(user => user.login == name)
    }
    if (usr.length == 0) {
      error.innerHTML = 'This user is not in the data base'
      error.style.display = 'block'
    } else if (usr[0].admin == false) {
      error.innerHTML = 'This user is not admin'
      error.style.display = 'block'
    } else {
      let user = await new UserModel({ id: usr[0].id }).fetch().promise()

      user.admin = false
      await new UserModel(user).save().done(() => {
        this.render()
      })
    }
  }

  async deleteTournament() {
    var error = document.getElementById('displayError')
    error.style.display = 'none'

    function getId() {
      var radios = document.getElementsByName('tournamentDelete')
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          return radios[i].value
        }
      }
    }

    var tournaments = await new TournamentModel().fetch().promise()

    new TournamentModel({ id: getId() })
      .destroy()
      .done(() => {
        this.render()
        if (tournaments.length == 2) this.cnBackSettings()
      })
      .fail(() => {
        error.innerHTML = "Error: the tournament can't be delete"
        error.style.display = 'block'
      })
  }

  async createTournament() {
    //--------------- Init settings ----------------//
    //---------------------------------------------//

    // On commence par effacer le message d'erreur puisque le joueur à reappuyé sur play
    var error = document.getElementById('displayError')
    error.style.display = 'none'

    // 1 -- Functions

    function getName() {
      return document.getElementById('tournamentName').value
    }

    function getDate(s) {
      let date
      if (s == 'begin') {
        date = document.getElementById('dateCreateTournamentBegin').value
      } else if (s == 'end') {
        date = document.getElementById('dateCreateTournamentEnd').value
      }
      return dayjs(
        date,
        [
          'DD/MM/YYYY',
          'HH:mm DD/MM/YYYY',
          'YYYY-MM-DDTHH:mm',
          'DD/MM/YYYY HH:mm'
        ],
        true
      )
    }

    function getMaxScore() {
      var maxScore = 10

      for (var i = 1; i <= maxScore; i++) {
        if (document.getElementById('radioMaxScore' + i).checked) return i
      }
    }

    function getBonus() {
      var bonus = ['BonusDefault', 'BonusBarrier', 'BonusDoubleBall']

      for (var i = 0; i < bonus.length; i++) {
        if (document.getElementById('radio' + bonus[i]).checked) return bonus[i]
      }
    }

    function getID(tournaments) {
      var id = 0
      var ids = []
      for (i = 1; i < tournaments.length; i++) {
        ids.push(tournaments[i].id_array)
      }
      for (var i = 1; i < tournaments.length + 1; i++) {
        if (!ids.includes(i)) {
          id = i
          break
        }
      }
      return id
    }

    function checkName(name, tournaments, error) {
      if (name == '') {
        error.innerHTML = 'Please enter a name'
        return false
      }
      for (let i = 0; i < tournaments.length; i++) {
        if (tournaments[i].name.toLowerCase() == name.toLowerCase()) {
          error.innerHTML = 'This name is already use for a tournament'
          return false
        }
      }
      return true
    }

    var tournaments = await new TournamentModel().fetch().promise()

    const setting = {
      name: getName(),
      id_array: getID(tournaments),
      begin: dayjs(getDate('begin')),
      end: dayjs(getDate('end')),
      maxScore: getMaxScore(),
      bonus: getBonus()
    }

    const today = dayjs(new Date())

    if (tournaments.length == 5) {
      error.innerHTML = 'You can only create a maximum of 4 tournaments'
      error.style.display = 'block'
    } else if (!checkName(setting.name, tournaments, error)) {
      error.style.display = 'block'
    } else if (!setting.begin.isValid()) {
      error.innerHTML = 'Please enter a valid start date'
      error.style.display = 'block'
    } else if (setting.begin.isBefore(today)) {
      error.innerHTML = 'The start date cannot be passed'
      error.style.display = 'block'
    } else if (!setting.end.isValid()) {
      error.innerHTML = 'Please enter a valid end date'
      error.style.display = 'block'
    } else if (setting.end.isBefore(setting.begin)) {
      error.innerHTML = 'The end date cannot be before the start date'
      error.style.display = 'block'
    } else {
      const tournament = new TournamentModel({
        name: setting.name,
        id_array: setting.id_array,
        begin_date: setting.begin,
        end_date: setting.end,
        max_score: setting.maxScore,
        bonus: setting.bonus
      })
        .save()
        .done(() => {
          document.getElementById('radioTournamentCreate').checked = false
          document.getElementById('radioTournamentDelete').checked = true
          this.render()
        })
        .fail(() => {
          error.innerHTML = "Error: the tournament can't be create"
          error.style.display = 'block'
        })
    }
  }
}
