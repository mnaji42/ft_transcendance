import Backbone from 'backbone'
import { html, render } from 'lit-html'

import { icon as iconTemplate } from '../templates'
import { mdiSend } from '@mdi/js'

import css from '../styles/content'

import socketConsumer from '../socketConsumer'
import UserModel from '../models/UserModel'
import TournamentModel from '../models/TournamentModel'
import JoinTournamentModel from '../models/JoinTournamentModel'
import FindTournamentModel from '../models/FindTournamentModel'
import LeaveTournamentModel from '../models/LeaveTournamentModel'
import WarModel from '../models/WarModel'

import currentUser from '../currentUser'

import dayjs from 'dayjs'
import DefyNewModel from '../models/DefyNewModel'
import { pongGame } from '../pongGame'

function uncheck(id) {
  document.getElementById(id).checked = false
}
function uncheckSubSlide() {
  document.getElementById('radioOffLine').checked = false
  document.getElementById('radioRandom').checked = false
  document.getElementById('radioFriend').checked = false
  document.getElementById('radioWar').checked = false
}

const template = ({
  user,
  users,
  tournaments,
  tournamentUsers,
  actualWar
}) => html`
  <div class=${css.line}>
    <div
      id="colonePongGame"
      class=${css.colone}
      style=${'width: 66.68%;position:relative'}
    >
      <canvas id="pongGame" class=${css.pongGame}>
        <p>Sorry your navigator doesn't support canvas</p>
      </canvas>
      <p id="inGame" style=${'display: none'}>
        <input
          style=${'display: none'}
          type="checkbox"
          id="abandon"
          name="abandon"
          value="abandon"
        />
        <label class=${css.buttonStart} for="abandon">Abandon</label>
      </p>
      <section id="tournamentTreeView" class=${css.tournamentTreeView}>
        <div class=${css.container}>
          <div class=${css.round_one}>
            <h2>Quarters</h2>
            <div class=${css.matchup}>
              <ul>
                <li>
                  <span id="tournamentTreeDisplayName-1-1">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-1-1"
                    class=${css.score}
                  ></span>
                </li>
                <li>
                  <span id="tournamentTreeDisplayName-1-2">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-1-2"
                    class=${css.score}
                  ></span>
                </li>
              </ul>
              <a
                ><img
                  style="display:none"
                  id="tournamentTreeViewStreamLive-1-1"
                  data-tournament-stream-btn="1-1"
                  src="/imgs/contentHomeView/icons/play_icon.png"
              /></a>
            </div>
            <div class=${css.matchup}>
              <ul>
                <li>
                  <span id="tournamentTreeDisplayName-1-3">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-1-3"
                    class=${css.score}
                  ></span>
                </li>
                <li>
                  <span id="tournamentTreeDisplayName-1-4">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-1-4"
                    class=${css.score}
                  ></span>
                </li>
              </ul>
              <a
                ><img
                  style="display:none"
                  id="tournamentTreeViewStreamLive-1-3"
                  data-tournament-stream-btn="1-3"
                  src="/imgs/contentHomeView/icons/play_icon.png"
              /></a>
            </div>
            <div class=${css.matchup}>
              <ul>
                <li>
                  <span id="tournamentTreeDisplayName-1-5">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-1-5"
                    class=${css.score}
                  ></span>
                </li>
                <li>
                  <span id="tournamentTreeDisplayName-1-6">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-1-6"
                    class=${css.score}
                  ></span>
                </li>
              </ul>
              <a
                ><img
                  style="display:none"
                  id="tournamentTreeViewStreamLive-1-5"
                  data-tournament-stream-btn="1-5"
                  src="/imgs/contentHomeView/icons/play_icon.png"
              /></a>
            </div>
            <div class=${css.matchup}>
              <ul>
                <li>
                  <span id="tournamentTreeDisplayName-1-7">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-1-7"
                    class=${css.score}
                  ></span>
                </li>
                <li>
                  <span id="tournamentTreeDisplayName-1-8">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-1-8"
                    class=${css.score}
                  ></span>
                </li>
              </ul>
              <a
                ><img
                  style="display:none"
                  id="tournamentTreeViewStreamLive-1-7"
                  data-tournament-stream-btn="1-7"
                  src="/imgs/contentHomeView/icons/play_icon.png"
              /></a>
            </div>
          </div>

          <div class=${css.round_two}>
            <h2>Demis</h2>
            <div class=${css.matchup}>
              <ul>
                <li>
                  <span id="tournamentTreeDisplayName-2-1">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-2-1"
                    class=${css.score}
                  ></span>
                </li>
                <li>
                  <span id="tournamentTreeDisplayName-2-2">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-2-2"
                    class=${css.score}
                  ></span>
                </li>
              </ul>
              <a
                ><img
                  style="display:none"
                  id="tournamentTreeViewStreamLive-2-1"
                  data-tournament-stream-btn="2-1"
                  src="/imgs/contentHomeView/icons/play_icon.png"
              /></a>
            </div>
            <div class=${css.matchup}>
              <ul>
                <li>
                  <span id="tournamentTreeDisplayName-2-3">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-2-3"
                    class=${css.score}
                  ></span>
                </li>
                <li>
                  <span id="tournamentTreeDisplayName-2-4">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-2-4"
                    class=${css.score}
                  ></span>
                </li>
              </ul>
              <a
                ><img
                  style="display:none"
                  id="tournamentTreeViewStreamLive-2-3"
                  data-tournament-stream-btn="2-3"
                  src="/imgs/contentHomeView/icons/play_icon.png"
              /></a>
            </div>
          </div>

          <div class=${css.round_three}>
            <h2>Final</h2>
            <div class=${css.matchup}>
              <ul>
                <li>
                  <span id="tournamentTreeDisplayName-3-1">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-3-1"
                    class=${css.score}
                  ></span>
                </li>
                <li>
                  <span id="tournamentTreeDisplayName-3-2">Waiting...</span
                  ><span
                    id="tournamentTreeDisplayScore-3-2"
                    class=${css.score}
                  ></span>
                </li>
              </ul>
              <a
                ><img
                  style="display:none"
                  id="tournamentTreeViewStreamLive-3-1"
                  data-tournament-stream-btn="3-1"
                  src="/imgs/contentHomeView/icons/play_icon.png"
              /></a>
            </div>
          </div>
        </div>
      </section>
      <p id="inTournamentQuit" style=${'display: none'}>
        <button class=${css.buttonStart} id="quitTournament">Quit</button>
      </p>
      <p id="gameIsFinish" style=${'display: none'}>
        <button class=${css.buttonFinish} id="BackHome">Back to menu</button>
      </p>
      <section class=${css.cnContainer} id="chooseSettings">
        ${[
          ['Training', 'training'],
          ['Competition', 'training'],
          ['OffLine', 'gameMode'],
          ['Random', 'gameMode'],
          ['Friend', 'gameMode'],
          ['War', 'gameMode'],
          ['Tournament', 'gameMode'],
          ['TournamentClassic', 'tournament'],
          ['TournamentCreate', 'tournament'],
          ['TournamentDelete', 'tournament'],
          ['TournamentUnchecked', 'tournament']
        ].map(
          chaine => html`
            <input
              class=${css['radio' + chaine[0]]}
              type="radio"
              style="display: none"
              id=${'radio' + chaine[0]}
              name=${chaine[1]}
              value=${chaine[0].toLowerCase()}
            />
          `
        )}
        ${tournaments.map(
          tournament => html`
            <input
              class=${css['radioTournamentSpecial' + tournament.id_array]}
              type="radio"
              style="display: none"
              id=${'radioTournamentSpecial' + tournament.id_array}
              name="tournament"
              value=${tournament.id}
            />
          `
        )}
        ${[
          ['MaxScore5', 'maxScore', '5'],
          ['MapDefault', 'chooseMap', 'default'],
          ['BonusDefault', 'chooseBonus', 'bonusDefault'],
          ['LvlNewb', 'chooseLvl', 'newb']
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
          ['MapSoccer', 'chooseMap', 'soccer'],
          ['MapBasket', 'chooseMap', 'basket'],
          ['BonusBarrier', 'chooseBonus', 'bonusBarrier'],
          ['BonusDoubleBall', 'chooseBonus', 'bonusDoubleBall'],
          ['LvlPro', 'chooseLvl', 'pro'],
          ['LvlLegend', 'chooseLvl', 'legend']
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
        <div class=${css.chooseTraining}>
          <nav>
            <label class=${css.labelChooseTraining} for="radioTraining"
              >Training</label
            >
            <label class=${css.labelChooseTraining} for="radioCompetition"
              >Competition</label
            >
          </nav>
        </div>
        <div class=${css.slideTraining}>
          <h2>Training</h2>
          <a
            onclick="getElementById('radioTraining').checked = false"
            class=${css.cnBack}
            ><img src="https://img.icons8.com/android/50/000000/left2.png"
          /></a>
          <nav>
            <label for="radioOffLine" class=${css.labelSubSlide}
              >Off Line</label
            >
            <label for="radioRandom" class=${css.labelSubSlide}>Random</label>
            <label for="radioFriend" class=${css.labelSubSlide}>Friend</label>
          </nav>
        </div>
        <div class=${css.slideCompetition}>
          <h2>Competition</h2>
          <a
            onclick="getElementById('radioCompetition').checked = false"
            class=${css.cnBack}
            ><img src="https://img.icons8.com/android/50/000000/left2.png"
          /></a>
          <nav>
            <label for="radioRandom" class=${css.labelSubSlide}>Random</label>
            ${actualWar
              ? html`
                  <label for="radioWar" class=${css.labelSubSlide}>War</label>
                `
              : null}
            <label for="radioTournament" class=${css.labelSubSlide}
              >Tournament</label
            >
          </nav>
        </div>
        <div class=${css.slideTournament}>
          <h2>Tournament</h2>
          <a
            onclick="getElementById('radioTournament').checked = false"
            class=${css.cnBack}
            ><img src="https://img.icons8.com/android/50/000000/left2.png"
          /></a>
          <nav style=${tournaments.length == 1 ? 'display :none' : ''}>
            <h3>Special</h3>
            ${tournaments.map(
              tournament =>
                html`
                  <label
                    for=${'radioTournamentSpecial' + tournament.id_array}
                    class=${css.labelSubSlide}
                    style=${tournament.id_array == 0 ? 'display: none' : ''}
                    data-find-tournament-game="${tournament.id}"
                  >
                    ${tournament.name}
                  </label>
                `
            )}
          </nav>
          <nav>
            <h3>Classic</h3>
            <label
              for="radioTournamentClassic"
              class=${css.labelSubSlide}
              data-find-tournament-game="1"
              >Classic</label
            >
          </nav>
        </div>
        <div class=${css.slideSettings}>
          <h2>Settings</h2>
          <a id="cnBackSettings" class=${css.cnBack}
            ><img src="https://img.icons8.com/android/50/000000/left2.png"
          /></a>
          <div class=${css.cnContent}>
            ${tournaments.map(
              tournament =>
                html`
                  <div class=${css['rulesTournament' + tournament.id_array]}>
                    <h3>Rules</h3>
                    <p style=${tournament.id_array == 0 ? 'display :none' : ''}>
                      Start :
                      ${dayjs(tournament.begin_date).format('DD/MM/YYYY HH:mm')}
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
            <div class=${css.playerWaitingTournament}>
              <h3>Player waiting</h3>
              <p>
                ${tournamentUsers.map(
                  ({ user: { avatar_url, displayname } }) => html`
                    <img
                      id=${avatar_url}
                      src=${avatar_url}
                      alt=${displayname}
                      width="80px"
                      height="80px"
                    />
                  `
                )}
              </p>
            </div>
            ${actualWar
              ? html`
                  <div class=${css.actualWarInfo}>
                    <h3>${actualWar.guild1} VS ${actualWar.guild2}</h3>
                    <p>
                      <span
                        style=${actualWar.guild1_points ==
                        actualWar.guild2_points
                          ? 'color:black'
                          : actualWar.guild1_points < actualWar.guild2_points
                          ? 'color:red'
                          : 'color:green'}
                        >${actualWar.guild1_points}</span
                      >
                      -
                      <span
                        style=${actualWar.guild1_points ==
                        actualWar.guild2_points
                          ? 'color:black'
                          : actualWar.guild1_points > actualWar.guild2_points
                          ? 'color:red'
                          : 'color:green'}
                        >${actualWar.guild2_points}</span
                      >
                    </p>
                    <p>
                      WarTime : ${dayjs(actualWar.warTimeBegin).format('HH:mm')}
                      - ${dayjs(actualWar.warTimeEnd).format('HH:mm')}
                    </p>
                    <p>
                      End : ${dayjs(actualWar.end).format('DD/MM/YYYY HH:mm')}
                    </p>
                    <p>
                      Maximum of match without response:
                      ${actualWar.matchs_without_response} /
                      ${actualWar.matchs_max_without_response}
                    </p>
                  </div>
                `
              : null}
            <div class=${css.chooseMap}>
              <h3>Choose your map</h3>
              <p>
                ${['Default', 'Soccer', 'Basket'].map(
                  chaine =>
                    html`
                      <label for=${'radioMap' + chaine}>
                        <img
                          class=${css['labelMap' + chaine]}
                          src=${'/imgs/contentHomeView/maps/map' +
                            chaine +
                            '.png'}
                          alt=${chaine.toLowerCase()}
                          width="180"
                          height="120"
                        />
                      </label>
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
            <div class=${css.chooseLvl}>
              <h3>Choose your level</h3>
              <p>
                <label class=${css.labelLvlNewb} for="radioLvlNewb">Newb</label>
                <label class=${css.labelLvlPro} for="radioLvlPro">Pro</label>
                <label class=${css.labelLvlLegend} for="radioLvlLegend"
                  >Legend</label
                >
              </p>
            </div>
            <div class=${css.chooseFriend}>
              <h3>Invite your friend</h3>
              <p>
                <input
                  class=${css.labelFriend}
                  type="text"
                  placeholder="Name of your friend..."
                  id="nameOfFriend"
                />
              </p>
            </div>
            <div class=${css.buttonValidateSettings}>
              <p id="displayError" class=${css.displayError}></p>
              <p id="displayInfo" class=${css.displayInfo}></p>
              <p class=${css.buttonPlayGame}>
                <button class=${css.buttonStart} id="startGame">Play</button>
              </p>
              <p class=${css.buttonJoinTournament}>
                <button class=${css.buttonStart} id="joinTournament">
                  Join
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
      <div id="searchOpponant" class=${css.searchOpponant}>
        <p id="searchOpTxt" class=${css.searchOpTxt}></p>
        <input
          style=${'display: none'}
          type="checkbox"
          id="quitSearch"
          name="quitSearch"
          value="quitSearch"
        />
        <label class=${css.labelQuitSearch} for="quitSearch">Quit</label>
      </div>
    </div>
    <div class=${css.colone} style=${'width: 0px'}></div>
    <div class=${css.colone} style="background-color: #252e38;">
      <table class=${css.friendTable}>
        <tr class=${css.guildsRankColone}>
          <td></td>
          <td>name</td>
          <td>rank</td>
          <td>points</td>
          <td>guild</td>
        </tr>
        ${users.map(
          r_user => html`
            <tr class=${css.user} title=${r_user.displayname}>
              <td>
                <div
                  class=${css.userPicture}
                  style="background-image: url(${r_user.avatar_url})"
                ></div>
              </td>
              <td class=${css.friendOnline}>
                <a href="/profile/${r_user.id}">${r_user.displayname}</a>
              </td>
              <td>${r_user.rank}</td>
              <td>${r_user.points}</td>
              <td>${r_user.guild_anagram}</td>
            </tr>
          `
        )}
      </table>
    </div>
  </div>
`

export default class ContentHomeView extends Backbone.View {
  constructor(args = {}) {
    super({
      events: {
        'click button#create-guild': 'create_guild',
        'click button#startGame': 'connexion',
        'click button#BackHome': 'backHome',
        'click #cnBackSettings': 'cnBackSettings',
        'click [data-find-tournament-game]': 'findTournamentGame',
        'click #joinTournament': 'connectTournamentGame',
        'click #quitTournament': 'quitTournament',
        'click [data-tournament-stream-btn]': 'startTournamentStream'
      },
      ...args
    })
    this.users = []
    this.tournamentUsers = []
    this.name = 'Home'
  }

  async render() {
    this.tournaments = await new TournamentModel().fetch().promise()

    this.actual_war = null
    this.users = await new UserModel().fetch().promise()
    this.user = this.users.filter(usr => usr.id == currentUser().id)[0]
    if (this.user.guild && this.user.guild.actual_war_id) {
      this.actual_war = await new WarModel({
        id: this.user.guild.actual_war_id
      })
        .fetch()
        .promise()
    }
    render(
      template({
        user: this.user,
        users: this.users,
        tournaments: this.tournaments,
        tournamentUsers: this.tournamentUsers,
        actualWar: this.actual_war
      }),
      this.el
    )
  }

  async remove() {
    if (this.gameChannel) {
      this.gameChannel.send({ event: 'giveup' })
      this.gameChannel.unsubscribe()
      this.gameChannel = null
    }

    if (this.tournamentGame)
      await new LeaveTournamentModel({
        tournament_game_id: this.tournamentGame.id
      })
        .save()
        .promise()
    if (this.tournamentChannel) this.tournamentChannel.unsubscribe()
    this.tournamentChannel = null

    this.currentGames = null
    this.tournamentGame = null
    this.tournamentUsers = []

    this.undelegateEvents()
  }

  backHome() {
    document.getElementById('gameIsFinish').style.display = 'none'
    document.getElementById('pongGame').style.display = 'none'
    document.getElementById('chooseSettings').style.display = 'block'
  }

  cnBackSettings() {
    document.getElementById('radioOffLine').checked = false
    document.getElementById('radioRandom').checked = false
    document.getElementById('radioFriend').checked = false
    document.getElementById('radioWar').checked = false
    document.getElementById('radioTournamentClassic').checked = false
    document.getElementById('radioTournamentUnchecked').checked = true
    document.getElementById('displayError').style.display = 'none'
  }

  async quitTournament() {
    // Ici le joueur quite le tournoi, donc:
    // Soit le tournoi a dejà commencé donc on lui compte comme un abandon
    // Soit il a pas commencer et on le sort juste du tournoi (une autre personne peut prendre sa place)

    this.loseGame = true
    if (!this.tournamentStarted) {
      this.tournamentJoined = false
    } else {
      this.gameChannel.send({ event: 'giveup' })
      this.gameChannel.unsubscribe()
      this.gameChannel = null
    }

    await new LeaveTournamentModel({
      tournament_game_id: this.tournamentGame.id
    })
      .save()
      .promise()

    this.currentGames = null

    document.getElementById('tournamentTreeView').style.display = 'none'
    document.getElementById('inTournamentQuit').style.display = 'none'
    document.getElementById('chooseSettings').style.display = 'block'
    await this.render()
  }

  startTournamentStream(ev) {
    const [pos_x, pos_y] = ev.currentTarget
      .getAttribute('data-tournament-stream-btn')
      .split('-')

    'Spectate', pos_x, pos_y, this.tournamentUsers, this.currentGames

    const tu = this.tournamentUsers.find(
      tu => tu.pos_x == pos_x && tu.pos_y == pos_y
    )
    const game = this.currentGames.find(
      game =>
        game.player_1.user_id == tu.user_id ||
        game.player_2.user_id == tu.user_id
    )

    this.trigger('spectate', game.id)
  }

  tournamentUpdateScore(pl, score) {
    document.getElementById(
      'tournamentTreeDisplayScore-' + pl.pos_x + '-' + pl.pos_y
    ).innerHTML = score
  }

  tournamentDisplayButtonStream(pl) {
    if (pl.pos_y % 2) {
      document.getElementById(
        'tournamentTreeViewStreamLive-' + pl.pos_x + '-' + pl.pos_y
      ).style.display = 'block'
    }
  }

  tournamentView(winner = null, loser = null) {
    // tournamentTreeDisplayName-x-y
    // tournamentTreeDisplayScore-x-y
    //tournamentTreeViewStreamLive-x-y (avec x-y == la position du premier joueur de la partie)
    // tournamentTreeView
    document.getElementById('chooseSettings').style.display = 'none'
    document.getElementById('tournamentTreeView').style.display = 'block'
    document.getElementById('inTournamentQuit').style.display = 'block'

    function playerGetPlace(pl) {
      // Fonction qui place le nom du joueur au bon endroit en fonction de sa possition dans le tournois

      const el = document.getElementById(
        'tournamentTreeDisplayName-' + pl.pos_x + '-' + pl.pos_y
      )
      el.innerHTML = pl.user.displayname
      el.style.color = 'black'
    }

    function playerRemovePlace(pl) {
      // Fonction qui retire le nom du joueur (si il quitte le tournoi avant qu'il ai commencé pour laisser la place a quelau'un d'autre)
      const displayName = document.getElementById(
        'tournamentTreeDisplayName-' + pl.pos_x + '-' + pl.pos_y
      )
      displayName.innerHTML = 'Waiting...'
      displayName.style.color = 'grey'
    }

    function removeButtonStream(pl) {
      // Fonction qui supprime le boutton pour stream la partie en fonction de si le joueur est en game ou pas
      if (pl.pos_y % 2) {
        document.getElementById(
          'tournamentTreeViewStreamLive-' + pl.pos_x + '-' + pl.pos_y
        ).style.display = 'none'
      }
    }

    function playerWin(pl) {
      // Si le joueur à fini sa partie et à gagné
      //color: settings.map == 'MapBasket' ? 'black' : 'white',
      const winner = document.getElementById(
        'tournamentTreeDisplayName-' + pl.pos_x + '-' + pl.pos_y
      )
      const loser =
        pl.pos_y % 2
          ? document.getElementById(
              'tournamentTreeDisplayName-' + pl.pos_x + '-' + (pl.pos_y + 1)
            )
          : document.getElementById(
              'tournamentTreeDisplayName-' + pl.pos_x + '-' + (pl.pos_y + -1)
            )

      winner.style.background = 'green'
      loser.style.background = 'red'
      winner.style.color = 'white'
      loser.style.color = 'white'
    }

    if (winner) {
      playerWin(winner)
      removeButtonStream(winner)
      removeButtonStream(loser)
    }

    this.lastTournamentUsers,
      this.tournamentUsers,
      (this.lastTournamentUsers || []).filter(
        tuser => !this.tournamentUsers.find(t => t.id === tuser.id)
      )
    if (this.lastTournamentUsers) {
      this.lastTournamentUsers
        .filter(tuser => !this.tournamentUsers.find(t => t.id === tuser.id))
        .forEach(tuser => playerRemovePlace(tuser))
    }

    this.lastTournamentUsers = this.tournamentUsers

    this.tournamentUsers.forEach(user => {
      playerGetPlace(user)
    })
  }

  async findTournamentGame(ev) {
    const tournamentId = parseInt(
      ev.currentTarget.getAttribute('data-find-tournament-game')
    )

    this.tournamentStarted = false
    const onEvent = async event => {
      this.tournamentGame = event.tournament_game

      this.tournamentUsers = await Promise.all(
        event.tournament_game_users.map(async tournament_game_user => {
          const memo = this.tournamentUsers.find(
            ({ user }) => user.id === tournament_game_user.user_id
          )

          if (memo) return { ...memo, ...tournament_game_user }
          return {
            user: await new UserModel({ id: tournament_game_user.user_id })
              .fetch()
              .promise(),
            ...tournament_game_user
          }
        })
      )

      await this.render()

      if (event.notification === 'user_joined') {
        if (this.tournamentJoined) this.tournamentView()
      } else if (event.notification === 'user_left') {
        if (this.tournamentJoined && event.user.id !== currentUser().id)
          this.tournamentView(event.winner, event.loser)
      } else if (event.notification === 'started') {
        this.tournamentStarted = true
      } else if (event.notification === 'win') {
        if (this.tournamentJoined)
          this.tournamentView(event.winner, event.loser)
      } else if (event.notification === 'update_score') {
        if (this.tournamentJoined)
          this.tournamentUpdateScore(event.player, event.score)
      } else if (event.notification === 'end') {
      } else if (
        event.notification === 'start_games' &&
        this.tournamentJoined
      ) {
        this.currentGames = event.games

        this.tournamentUsers
          .filter(player => !player.eliminated)
          .forEach(player => {
            this.tournamentUpdateScore(player, 0)
            this.tournamentDisplayButtonStream(player)
          })

        const myId = currentUser().id

        const game = this.currentGames.find(
          game =>
            game.player_1.user_id === myId || game.player_2.user_id === myId
        )
        const tournament = this.tournaments.find(
          ({ id }) => this.tournamentGame.tournament_id === id
        )

        if (game)
          this.pongGame({
            gameId: game.id,
            training: false,
            gameMode: 'Tournament',
            maxScore: tournament.max_score,
            map: this.getMap(),
            bonus: tournament.bonus,
            lvl: 0,
            friend: '',
            player: game.player_1.user_id === myId ? 1 : 2 // 1 si il joue à gauche et 2 si il joue à droite
          })
      }
    }

    this.tournamentId = tournamentId
    const found = await new FindTournamentModel({
      tournament_id: tournamentId
    })
      .save()
      .promise()

    await onEvent(found)

    this.tournamentJoined = false
    this.loseGame = false

    this.tournamentChannel = socketConsumer.subscriptions.create(
      { channel: 'TournamentChannel', game_id: this.tournamentGame.id },
      {
        received(event) {
          onEvent(event)
        }
      }
    )
  }

  async connectTournamentGame() {
    const error = document.getElementById('displayError')
    const infoDiv = document.getElementById('displayInfo')
    error.style.display = 'none'

    function checkTournamentTime(begin, end, error) {
      const today = dayjs(new Date())

      if (today.isBefore(dayjs(begin))) {
        error.innerHTML = 'The tournament is not started yet'
        error.style.display = 'block'
        return false
      }
      if (end.isBefore(dayjs(today))) {
        error.innerHTML = 'The tournament is finished'
        error.style.display = 'block'
        return false
      }
      return true
    }

    const tournament = this.tournaments.find(t => t.id == this.tournamentId)
    if (
      tournament.name != 'Classic' &&
      !checkTournamentTime(
        dayjs(tournament.begin_date),
        dayjs(tournament.end_date),
        error
      )
    )
      return

    await new JoinTournamentModel({ game_id: this.tournamentGame.id })
      .save()
      .promise()
    this.tournamentJoined = true
    this.loseGame = false
    this.tournamentView()
  }

  getMap() {
    var map = ['MapDefault', 'MapSoccer', 'MapBasket']

    for (var i = 0; i < map.length; i++) {
      if (document.getElementById('radio' + map[i]).checked) return map[i]
    }
  }

  async connexion() {
    //--------------- Init settings ----------------//
    //---------------------------------------------//

    // On commence par effacer le message d'erreur puisque le joueur à reappuyé sur play
    const error = document.getElementById('displayError')
    const infoDiv = document.getElementById('displayInfo')
    error.style.display = 'none'

    // 1 -- Functions
    function isTraining() {
      if (document.getElementById('radioTraining').checked) return true
      return false
    }

    function getGameMode() {
      var gameMode = ['OffLine', 'Random', 'Friend', 'War']

      for (var i = 0; i < gameMode.length; i++) {
        if (document.getElementById('radio' + gameMode[i]).checked)
          return gameMode[i]
      }
    }

    function getMaxScore() {
      var maxScore = 10

      for (var i = 1; i <= maxScore; i++) {
        if (document.getElementById('radioMaxScore' + i).checked) return i
      }
    }

    function getMap() {
      var map = ['MapDefault', 'MapSoccer', 'MapBasket']

      for (var i = 0; i < map.length; i++) {
        if (document.getElementById('radio' + map[i]).checked) return map[i]
      }
    }

    function getBonus() {
      var bonus = ['BonusDefault', 'BonusBarrier', 'BonusDoubleBall']

      for (var i = 0; i < bonus.length; i++) {
        if (document.getElementById('radio' + bonus[i]).checked) return bonus[i]
      }
    }

    function getLevel() {
      var level = ['LvlNewb', 'LvlPro', 'LvlLegend']

      for (var i = 0; i < level.length; i++) {
        if (document.getElementById('radio' + level[i]).checked) return level[i]
      }
    }

    function getFriend() {
      return document.getElementById('nameOfFriend').value
    }

    function checkWarTime(warTimeBegin, warTimeEnd) {
      const today = dayjs(new Date())

      // const [hr, mn] = warTime.split(':')
      const begin = today
        .set('hour', dayjs(warTimeBegin).hour())
        .set('minute', dayjs(warTimeBegin).minute())
        .set('second', '00')

      const end = today
        .set('hour', dayjs(warTimeEnd).hour())
        .set('minute', dayjs(warTimeEnd).minute())
        .set('second', '00')

      if (
        (end.isBefore(begin) && begin.isBefore(today)) ||
        (begin.isBefore(today) && today.isBefore(end))
      )
        return true
      return false
    }

    // 2 -- Init settings
    var settings = {
      training: isTraining(),
      gameMode: getGameMode(),
      maxScore: getMaxScore(),
      map: this.getMap(),
      bonus: getBonus(),
      lvl: getLevel(),
      friend: getFriend(),
      player: 0 // 1 si il joue à gauche et 2 si il joue à droite
    }
    if (settings.gameMode != 'Friend' && settings.gameMode != 'OffLine')
      settings.maxScore = settings.gameMode == 'Tournament' ? 2 : 5

    if (
      settings.gameMode == 'War' &&
      !checkWarTime(this.actual_war.warTimeBegin, this.actual_war.warTimeEnd)
    ) {
      error.innerHTML = 'The WarTime is not started'
      error.style.display = 'block'
      return
    }

    // 3 -- Connexion ----

    //Du coup j'ai fait un truc vite fais juste pour donner une idée

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    var point = 0
    var quit = 0
    var interval
    let matchmakingSubscription
    let matchmakingPromiseRes
    let matchmakingPromise = new Promise(res => (matchmakingPromiseRes = res))

    async function printWaitingTxt(pTxt, txt) {
      if (point % 3 == 0) pTxt.innerHTML = txt + ' .'
      else if (point % 3 == 1) pTxt.innerHTML = txt + ' ..'
      else pTxt.innerHTML = txt + ' ...'

      //guard
      if (!document.getElementById('quitSearch')) {
        clearInterval(interval)
        return
      }

      if (document.getElementById('quitSearch').checked) {
        document.getElementById('quitSearch').checked = false
        clearInterval(interval)
        displaySearching(false)
        quit = 1
        if (matchmakingPromiseRes) matchmakingPromiseRes()
      }
      point++
    }

    function displaySearching(display, dTxt) {
      var div = document.getElementById('searchOpponant')

      if (display == true) {
        var height = document.getElementById('colonePongGame').offsetHeight
        var width = document.getElementById('colonePongGame').offsetWidth
        var txt = document.getElementById('searchOpTxt')

        div.style.height = height + 'px'
        div.style.width = width + 'px'
        div.style.display = 'block'
        txt.innerHTML = dTxt
        interval = setInterval(function() {
          printWaitingTxt(txt, dTxt)
        }, 500)
      } else div.style.display = 'none'
    }

    //--------------- function searchPlayer() ---------------
    // L'idee dans cette fonction est de creer une connexion avec un adversaire aleatoire
    // Si il trouve un joueur il aura un id joueur (1 à gauche 2 à droite)
    // Du coup le joueur aura l'autre id
    // Si il n'y a pas de joueur qui cherche au meme moment sont id restera à 0 ce qui permettra de mettre un message d'erreur
    // Dans mon exemple l'id sera donc egal à 0
    async function searchPlayer() {
      displaySearching(true, 'Searching opponant')

      matchmakingSubscription = socketConsumer.subscriptions.create(
        settings.gameMode === 'War'
          ? { channel: 'WarsChannel' }
          : { channel: 'MatchmakingChannel', ranked: !settings.training },
        {
          received(event) {
            clearInterval(interval)
            displaySearching(false)
            if (!event.found) {
              error.innerHTML = 'We could not find an opponant'
              error.style.display = 'block'
            } else {
              const myId = currentUser().id
              settings.gameId = event.game.id
              settings.player = event.game.player1_id == myId ? 1 : 2
            }

            matchmakingPromiseRes()
          },
          rejected() {
            clearInterval(interval)
            displaySearching(false)
            error.innerHTML =
              'There is already an ongoing match or someone searching for a match in your guild'
            error.style.display = 'block'
            matchmakingPromiseRes()
          }
        }
      )

      await matchmakingPromise
      matchmakingSubscription.unsubscribe()
    }

    //--------------- function waitFriend() ---------------
    // L'idee dans cette fonction est de creer une connexion avec son ami
    // Si son amis accepte il aura un id joueur (1 à gauche 2 à droite)
    // Du coup le joueur aura l'autre id
    // Si son amis refuse (ou ne repond pas dans le temps impartit) notre id restera à 0 on pourras donc dire que la personne n'a pas repondu
    // Dans mon exemple l'id sera donc egal à 0
    async function waitFriend() {
      displaySearching(true, 'Waiting for ' + settings.friend)
      await sleep(30000)
      if (quit != 1) {
        clearInterval(interval)
        displaySearching(false)
        if (settings.player == 0) {
          error.innerHTML =
            settings.friend + ' does not respond or rejected the proposition'
          error.style.display = 'block'
        }
      }
      return new Promise(resolve => setTimeout(resolve, 0))
    }

    async function getPlayer() {
      if (settings.gameMode == 'OffLine') {
        // Il n'y a pas de connexion a faire ici (mode hors ligne)
        settings.player = 1
      } else if (settings.gameMode == 'Friend') {
        //- On commence par verifier si friend existe quand il essaye de lancer une partie avec un amis -//
        // En realite il faut chequer si il existe dans sa liste d'amis
        // Si il est en ligne
        // Et si il repond pas

        const friends = await Promise.all(
          currentUser().friends_id.map(id =>
            new UserModel({ id }).fetch().promise()
          )
        )

        const friend = friends.find(f => f.login === settings.friend)

        if (!friend) {
          error.innerHTML = settings.friend + ' is not in your friend list'
          error.style.display = 'block'
          return
        } else if (!friend.status === 'online') {
          error.innerHTML = settings.friend + ' is not connected or is in game'
          error.style.display = 'block'
          return
        }

        await new DefyNewModel({
          user_id: friend.id,
          bonus: settings.bonus,
          map: settings.map
        })
          .save()
          .promise()

        await waitFriend()
      } else await searchPlayer()
      return new Promise(resolve => setTimeout(resolve, 0))
    }

    await getPlayer()

    if (settings.player != 0) this.pongGame(settings)
  }

  pongGame(settings) {
    pongGame(this, settings)
  }
}
