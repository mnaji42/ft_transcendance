import Backbone from 'backbone'
import { html, render } from 'lit-html'

import { icon as iconTemplate } from '../../templates'
import {
  mdiSend,
  mdiCrown,
  mdiPodium,
  mdiMedalOutline,
  mdiSwordCross
} from '@mdi/js'

import css from '../../styles/content'

import currentUser, { update as updateUser } from '../../currentUser'

import UserModel from '../../models/UserModel'
import GuildModel from '../../models/GuildModel'
import WarModel from '../../models/WarModel'
import GuildAddMemberModel from '../../models/GuildAddMemberModel'
import GuildPromoteMemberModel from '../../models/GuildPromoteMemberModel'
import GuildBanMemberModel from '../../models/GuildBanMemberModel'
import GuildQuitModel from '../../models/GuildQuitModel'
import WarAbandonModel from '../../models/WarAbandonModel'
import WarAcceptModel from '../../models/WarAcceptModel'
import WarCancelModel from '../../models/WarCancelModel'
import WarDeclineModel from '../../models/WarDeclineModel'
import WarNewModel from '../../models/WarNewModel'
import dayjs from 'dayjs'

const template = ({
  user,
  guildSelected,
  userGuild,
  userGuild_members,
  guilds,
  pendingWars,
  requestWars,
  nextWars,
  historyWars,
  actualWar
}) => html`
  <div class=${css.line}>
    <div
      class=${css.colone}
      style=${
        userGuild && userGuild.actual_war_id ? 'background-color: #d00000' : ''
      }
      id="content-guild-colonne"
    >
      <div style=${userGuild ? 'padding-top: 20px' : 'display :none'}>
        <span
          class=${css.selectData}
          title=${userGuild ? userGuild.name : ''}
          id="guild-element"
          >${userGuild ? userGuild.name : ''}</span
        >
      </div>
      <div style=${user.guild_id ? 'display :none' : ''}>
        <div class=${css.line}>
          <button class=${css.contentButton} id="create-guild">Create</button>
          <input id="name-create-guild" value="" />
          <input
            maxlength="5"
            id="name-anagram-guild"
            class=${css.anagram}
            value=""
          />
        </div>
      </div>
      <div
        style=${
          userGuild && user.id == userGuild.owner_id
            ? 'padding-top: 20px'
            : 'display :none'
        }
      >
        <button class=${css.contentButton} id="delete-guild">
          Delete Guild
        </button>
      </div>
      <div
        style=${
          userGuild && is_officer(user, userGuild)
            ? 'padding-top: 20px'
            : 'display :none'
        }
      >
        <input id="user-guild" value="" />
        <div>
          <button class=${css.contentButton} id="add-guild-member">Add</button>
          <button class=${css.contentButton} id="banne-guild-member">
            Ban
          </button>
          <button class=${css.contentButton} id="promote-guild-member">
            Promote
          </button>
          <label
            class=${css.contentButton}
            for="checkboxWar"
            id="war-guild-member"
            >War</label
          >
        </div>
      </div>
      <div class=${css.divError} id="divError"></div>
      <div
        style=${
          userGuild && userGuild.owner_id != user.id
            ? 'padding-top: 20px'
            : 'display :none'
        }
      >
        <button class=${css.contentButton} id="quit-guild">Quit</button>
      </div>
      <div style=${userGuild ? 'padding-top: 20px' : 'display :none'}>
        <table class=${css.guildsRank}>
          <tr class=${css.guildsRankColone}>
            <td>Member</td>
          </tr>
          ${
            userGuild && userGuild_members
              ? userGuild_members.map(
                  user => html`
                    <tr class=${css.guildsTabElement}>
                      <td
                        style=${is_officer(user, userGuild)
                          ? user.id == userGuild.owner_id
                            ? 'color: red'
                            : 'color: orange'
                          : ''}
                      >
                        ${user.login}
                      </td>
                    </tr>
                  `
                )
              : ''
          }
        </table>
      </div>
      <input
        type="checkbox"
        id="checkboxWar"
        class=${css.checkboxWar}
        style="display:none"
      />
      <section class=${css.cnContainerWar} id="containerSettingsWar">
        <div class=${css.slideSettingsWar}>
          <div class=${css.cnContent}>
            <a id="cnBackWar" class=${css.cnBackWar}
              ><img src="https://img.icons8.com/android/50/000000/left2.png"
            /></a>
            ${[
              'ActualWar',
              'NewWar',
              'WarRequest',
              'PendingWar',
              'HistoryWar',
              'WarUnchecked',
              'NextWar'
            ].map(
              chaine => html`
                <input
                  class=${css['radio' + chaine]}
                  style="display: none"
                  type="radio"
                  id=${'radio' + chaine}
                  name="radioWar"
                  value=${chaine}
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
            <div class=${css.collapse}>
              <label class=${css.labelActualWar} for="radioActualWar"
            >Actual war</label
              >
              <div class=${css.contentActualWar}>
                <div class=${css.innerContent}>
                <p style=${actualWar ? 'display:none' : ''}>
                  You are not at war
                </p>
                <div style=${!actualWar ? 'display:none' : ''}>
                  <h3>${actualWar.guild1} VS ${actualWar.guild2}</h3>
                  <p>
                    <span style=${
                      actualWar.guild1_points == actualWar.guild2_points
                        ? 'color:black'
                        : actualWar.guild1_points < actualWar.guild2_points
                        ? 'color:red'
                        : 'color:green'
                    }>${actualWar.guild1_points}</span> - 
                    <span style=${
                      actualWar.guild1_points == actualWar.guild2_points
                        ? 'color:black'
                        : actualWar.guild1_points > actualWar.guild2_points
                        ? 'color:red'
                        : 'color:green'
                    }>${actualWar.guild2_points}</span>
                  </p>
                  <p>WarTime : ${dayjs(actualWar.warTimeBegin).format(
                    'HH:mm'
                  )} - ${dayjs(actualWar.warTimeEnd).format('HH:mm')}</p>
                  <p>End : ${dayjs(actualWar.end).format(
                    'DD/MM/YYYY HH:mm'
                  )}</p>
                  <p>Prize: ${actualWar.prize}</p>
                  <h3>Rules</h3>
                  <p>
                    Maximum of match without response:
                    ${actualWar.matchs_max_without_response}
                  </p>
                  <p>
                    All matchs count towards the war effort:
                    ${actualWar.all_matchs_count ? 'Yes' : 'No'}
                  </p>
                  <p>
                    Number of points to win per match: ${actualWar.maxScore}
                  </p>
                  <p>Bonus in game: ${actualWar.bonus}</p>
                  <div class=${
                    css.buttonValidateSettings
                  } id='buttonActualWarWar' style='display:block'>
                    <button class=${css.buttonStart} id="abandonWarActualWar">
                      Abandon
                    </button>
                    </div>
                </div>
                </div>
              </div>
            </div>
            <div class=${css.collapse}>
              <label class=${
                css.labelNewWar
              } for="radioNewWar">Send request</label>
              <div class=${css.contentNewWar}>
                <div class=${css.innerContent}>
                  <h3>Name of the guild</h3>
                  <p>
                    <input
                      class=${css.labelFriend}
                      type="text"
                      placeholder="Name of the guild..."
                      id="nameOfGuildWar"
                    />
                  </p>
                  <h3>Choose the date of the war</h3>
                  <p>
                    Begin :
                    <input id="dateCreateWarBegin" type="datetime-local" />
                  </p>
                  <p>
                    End :
                    <input id="dateCreateWarEnd" type="datetime-local" />
                  </p>
                  <h3>Choose the date of the War time</h3>
                  <p>
                    Begin :
                    <input id="dateCreateWarTimeBegin" type="time" />
                  </p>
                  <p>
                    End :
                    <input id="dateCreateWarTimeEnd" type="time" />
                  </p>
                  <h3>Choose the rules</h3>
                  <p>
                    Choose the prize for the winner:
                    <select name="chooseWarPrize" id="chooseWarPrize">
                      <option value="1000">1000 pts</option>
                      <option value="2000">2000 pts</option>
                      <option value="3000">3000 pts</option>
                      <option value="4000">4000 pts</option>
                      <option value="5000">5000 pts</option>
                      <option value="6000">6000 pts</option>
                      <option value="7000">7000 pts</option>
                      <option value="8000">8000 pts</option>
                      <option value="9000">9000 pts</option>
                      <option value="10000">10000 pts</option>
                    </select>
                  </p>
                  <p>
                    <input type='checkbox' id='allMatchsCountWar'>
                    <label for='allMatchsCountWar'>
                      Any matchs played on ladder or during a tournament will count towards the war effort
                    </label>
                  </p>
                  <p>
                    Choose the maximum of match without response:
                    <select
                      name="chooseWarMaxMatchWithoutResponse"
                      id="chooseWarMaxMatchWithoutResponse"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                      <option value="30">30</option>
                      <option value="35">35</option>
                      <option value="40">40</option>
                      <option value="45">45</option>
                      <option value="50">50</option>
                    </select>
                  </p>
                  <p>
                    Number de points to win per match:
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
                  <p>
                    Bonus in game:
                    <label
                      class=${css.labelBonusDefault}
                      for="radioBonusDefault"
                      >Default</label
                    >
                    <label
                      class=${css.labelBonusBarrier}
                      for="radioBonusBarrier"
                      >Barrier</label
                    >
                    <label
                      class=${css.labelBonusDoubleBall}
                      for="radioBonusDoubleBall"
                      >Double Ball</label
                    >
                  </p>
                  <div
                    class=${css.buttonValidateSettings}
                    id="buttonValidateSettings"
                    style="display:block"
                  >
                    <p id="displayErrorNewWar" class=${css.displayError}></p>
                    <button class=${css.buttonStart} id="SendNewWar" }>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class=${css.collapse}>
              <label class=${css.labelNextWar} for="radioNextWar"
                >Next wars (${nextWars.length})</label
              >
              <div class=${css.contentNextWar}>
                <div class=${css.innerContent}>
                <p style=${nextWars.length > 0 ? 'display:none' : ''}>
                  You have no wars planned
                </p>
                <div style=${nextWars.length == 0 ? 'display:none' : ''}>
                <table>
                  <tr>
                      <th>Guild</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Prize</th>
                  </tr>
                    ${nextWars.map(
                      war => html`
                        <tr
                          class=${css['lineNextWarWar' + war.id]}
                          id="lineNextWarWar"
                          data-warid=${war.id}
                        >
                          <td id=${'nameGuildNextWarWar' + war.id}>
                            ${war.guild2 != userGuild.name
                              ? war.guild2
                              : war.guild1}
                          </td>
                          <td>
                            ${dayjs(war.start).format('DD/MM/YYYY HH:mm')}
                          </td>
                          <td>${dayjs(war.end).format('DD/MM/YYYY HH:mm')}</td>
                          <td>${war.prize}</td>
                        </tr>
                      `
                    )}
                  </table>
                  ${nextWars.map(
                    war => html`
                      <input
                        type="radio"
                        style="display:none"
                        id=${'radioNextWarWar' + war.id}
                        name="radioNextWarWar"
                        value=${war.id}
                      />
                      <div
                        id=${'rulesNextWarWar' + war.id}
                        style="display:none;width:100%;"
                      >
                        <h3>Rules</h3>
                        <p>
                          WarTime : ${dayjs(war.warTimeBegin).format('HH:mm')} -
                          ${dayjs(war.warTimeEnd).format('HH:mm')}
                        </p>
                        <p>
                          Maximum of match without response:
                          ${war.matchs_max_without_response}
                        </p>
                        <p>
                          All matchs count towards the war effort:
                          ${war.all_matchs_count ? 'Yes' : 'No'}
                        </p>
                        <p>
                          Number de points to win per match: ${war.maxScore}
                        </p>
                        <p>Bonus in game: ${war.bonus}</p>
                      </div>
                    `
                  )}
                  <div class=${
                    css.buttonValidateSettings
                  } id='buttonNextWarWar'>
                    <button class=${css.buttonStart} id="abandonWarNextWar">
                      Abandon
                    </button>
                    </div>
                    </div>
                </div>
              </div>
            </div>
            <div class=${css.collapse}>
              <label class=${css.labelWarRequest} for="radioWarRequest"
                >Wars request (${requestWars.length})</label
              >
              <div class=${css.contentWarRequest}>
                <div class=${css.innerContent}>
                <p style=${requestWars.length > 0 ? 'display:none' : ''}>
                  You d'ont have request of war
                </p>
                <div style=${requestWars.length == 0 ? 'display:none' : ''}>
                <table id='tableRequestWars'>
                  <tr>
                      <th>Guild</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Prize</th>
                  </tr>
                    ${requestWars.map(
                      war => html`
                        <tr
                          class=${css['lineRequestWar' + war.id]}
                          id="lineRequestWar"
                          data-warid=${war.id}
                        >
                          <td id=${'nameGuildRequestWar' + war.id}>
                            ${war.guild1}
                          </td>
                          <td>
                            ${dayjs(war.start).format('DD/MM/YYYY HH:mm')}
                          </td>
                          <td>${dayjs(war.end).format('DD/MM/YYYY HH:mm')}</td>
                          <td>${war.prize}</td>
                        </tr>
                      `
                    )}
                  </table>
                  ${requestWars.map(
                    war => html`
                      <input
                        type="radio"
                        style="display:none"
                        id=${'radioRequestWar' + war.id}
                        name="radioRequestWar"
                        value=${war.id}
                      />
                      <div
                        id=${'rulesRequestWar' + war.id}
                        style="display:none;width:100%;"
                      >
                        <h3>Rules</h3>
                        <p>
                          WarTime : ${dayjs(war.warTimeBegin).format('HH:mm')} -
                          ${dayjs(war.warTimeEnd).format('HH:mm')}
                        </p>
                        <p>
                          Maximum of match without response:
                          ${war.matchs_max_without_response}
                        </p>
                        <p>
                          All matchs count towards the war effort:
                          ${war.all_matchs_count ? 'Yes' : 'No'}
                        </p>
                        <p>
                          Number de points to win per match: ${war.maxScore}
                        </p>
                        <p>Bonus in game: ${war.bonus}</p>
                      </div>
                    `
                  )}
                  <div class=${
                    css.buttonValidateSettings
                  } id='buttonRequestWar'>
                    <p id="displayErrorAcceptWar"class=${css.displayError}></p>
                    <button class=${css.buttonStart} id="acceptWarRequest">
                      Accept
                    </button>
                    <button class=${css.buttonStart} id="declineWarRequest">
                      Decline
                    </button>
                    </div>
                    </div>
                </div>
              </div>
            </div>
            <div class=${css.collapse}>
              <label class=${css.labelPendingWar} for="radioPendingWar"
                >Pending request (${pendingWars.length})</label
              >
              <div class=${css.contentPendingWar}>
                <div class=${css.innerContent}>
                <p style=${pendingWars.length > 0 ? 'display:none' : ''}>
                  You d'ont have a pending request of war
                </p>
                <div style=${pendingWars.length == 0 ? 'display:none' : ''}>
                <table>
                  <tr>
                      <th>Guild</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Prize</th>
                  </tr>
                    ${pendingWars.map(
                      war => html`
                        <tr
                          class=${css['linePendingWar' + war.id]}
                          id="linePendingWar"
                          data-warid=${war.id}
                        >
                          <td id=${'nameGuildPendingWar' + war.id}>
                            ${war.guild2}
                          </td>
                          <td>
                            ${dayjs(war.start).format('DD/MM/YYYY HH:mm')}
                          </td>
                          <td>${dayjs(war.end).format('DD/MM/YYYY HH:mm')}</td>
                          <td>${war.prize}</td>
                        </tr>
                      `
                    )}
                  </table>
                  ${pendingWars.map(
                    war => html`
                      <input
                        type="radio"
                        style="display:none"
                        id=${'radioPendingWar' + war.id}
                        name="radioPendingWar"
                        value=${war.id}
                      />
                      <div
                        id=${'rulesPendingWar' + war.id}
                        style="display:none;width:100%;"
                      >
                        <h3>Rules</h3>
                        <p>
                          WarTime : ${dayjs(war.warTimeBegin).format('HH:mm')} -
                          ${dayjs(war.warTimeEnd).format('HH:mm')}
                        </p>
                        <p>
                          Maximum of match without response:
                          ${war.matchs_max_without_response}
                        </p>
                        <p>
                          All matchs count towards the war effort:
                          ${war.all_matchs_count ? 'Yes' : 'No'}
                        </p>
                        <p>
                          Number de points to win per match: ${war.maxScore}
                        </p>
                        <p>Bonus in game: ${war.bonus}</p>
                      </div>
                    `
                  )}
                  <div class=${
                    css.buttonValidateSettings
                  } id='buttonPendingWar'>
                    <button class=${css.buttonStart} id="cancelWarPending">
                      Cancel
                    </button>
                    </div>
                    </div>
              </div>
            </div>
            <div class=${css.collapse}>
              <label class=${css.labelHistoryWar} for="radioHistoryWar"
                >History wars (${historyWars.length})</label
              >
              <div class=${css.contentHistoryWar}>
                <div class=${css.innerContent}>
                <p style=${historyWars.length > 0 ? 'display:none' : ''}>
                  You have no history wars
                </p>
                <div style=${historyWars.length == 0 ? 'display:none' : ''}>
                  <table>
                  <tr>
                      <th>Guild</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Prize</th>
                      <th>Scores</th>
                      <th>Result</th>
                  </tr>
                    ${historyWars.map(
                      war => html`
                        <tr>
                          <td
                            style=${war.winner == null
                              ? 'color:black'
                              : (war.winner == 1 &&
                                  userGuild.name == war.guild2) ||
                                (war.winner == 2 &&
                                  userGuild.name == war.guild1)
                              ? 'color: green'
                              : 'color: red'}
                          >
                            ${userGuild.name == war.guild1
                              ? war.guild2
                              : war.guild1}
                          </td>
                          <td>
                            ${dayjs(war.start).format('DD/MM/YYYY HH:mm')}
                          </td>
                          <td>${dayjs(war.end).format('DD/MM/YYYY HH:mm')}</td>
                          <td>${war.prize}</td>
                          <td>
                            <span
                              style=${war.winner == null
                                ? 'color:black'
                                : war.winner == 1
                                ? 'color: green'
                                : 'color: red'}
                              >${war.guild1_points}</span
                            >/<span
                              style=${war.winner == null
                                ? 'color:white'
                                : war.winner == 2
                                ? 'color: green'
                                : 'color: red'}
                              >${war.guild1_points}</span
                            >
                          </td>
                          <td
                            style=${war.winner == null
                              ? 'color:white'
                              : (war.winner == 1 &&
                                  userGuild.name == war.guild2) ||
                                (war.winner == 2 &&
                                  userGuild.name == war.guild1)
                              ? 'color: red'
                              : 'color: green'}
                          >
                            ${war.winner == null
                              ? 'Null'
                              : (war.winner == 1 &&
                                  userGuild.name == war.guild2) ||
                                (war.winner == 2 &&
                                  userGuild.name == war.guild1)
                              ? 'Lose'
                              : 'Win'}
                          </td>
                        </tr>
                      `
                    )}
                  </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class=${css.colone}>
      <input id="search-guild" />
      <div style=${guildSelected ? '' : 'display :none'}>
        <p style="font-weight: bold">
          ${guildSelected.name} (${guildSelected.anagram})
        </p>
        <p>
          <span title="owner">${iconTemplate(mdiCrown)}</span>:
          ${guildSelected.owner}
        </p>
        <p>
          <span title="rank">${iconTemplate(mdiPodium)}</span>:
          ${guildSelected.rank}
        </p>
        <p>
          <span title="points">${iconTemplate(mdiMedalOutline)}</span>:
          ${guildSelected.points}
        </p>
        <p
          style=${
            guildSelected && guildSelected.actualWar ? '' : 'display :none'
          }
        >
          <span title="in war with">${iconTemplate(mdiSwordCross)}</span>:
          ${
            guildSelected.actualWar
              ? guildSelected.actualWar.guild1 != guildSelected.name
                ? guildSelected.actualWar.guild1
                : guildSelected.actualWar.guild2
              : ''
          }
        </p>
        <table
          class=${css.guildsRank}
          style=${
            guildSelected &&
            guildSelected.warHistory &&
            guildSelected.warHistory.length
              ? ''
              : 'display :none'
          }
        >
          <tr class=${css.guildsRankColone}>
            <td>Guild</td>
            <td>Start</td>
            <td>End</td>
            <td>Scores</td>
            <td>Result</td>
          </tr>
          ${
            guildSelected && guildSelected.warHistory
              ? guildSelected.warHistory.map(
                  war => html`
                    <tr
                      class=${css.guildsTabElement}
                      style=${war.winner == null
                        ? 'color:white'
                        : (war.winner == 1 &&
                            war.guild1 == guildSelected.name) ||
                          (war.winner == 2 && war.guild2 == guildSelected.name)
                        ? 'color: green'
                        : 'color: red'}
                    >
                      <td>
                        <span
                          class=${css.pointInfo}
                          id="guild-element"
                          title=${war.guild1 == guildSelected.name
                            ? war.guild2
                            : war.guild1}
                        >
                          ${war.guild1 == guildSelected.name
                            ? war.guild2
                            : war.guild1}</span
                        >
                      </td>
                      <td>
                        <span title=${war.start}
                          >${datetime_to_string(war.start)}</span
                        >
                      </td>
                      <td>
                        <span title=${war.end}
                          >${datetime_to_string(war.end)}</span
                        >
                      </td>
                      <td>${war.guild1_points}/${war.guild2_points}</td>
                      <td>
                        ${war.winner == null
                          ? 'Null'
                          : (war.winner == 1 &&
                              guildSelected.name == war.guild2) ||
                            (war.winner == 2 &&
                              guildSelected.name == war.guild1)
                          ? 'Lose'
                          : 'Win'}
                      </td>
                    </tr>
                  `
                )
              : ''
          }
        </table>
      </div>
    </div>
    <div class=${css.colone} style="background-color: #333;">
      <table class=${css.guildsRank}>
        <tr class=${css.guildsRankColone}>
          <td>Rank</td>
          <td>Name</td>
          <td>Anagram</td>
          <td>Points</td>
        </tr>
        ${
          guilds
            ? guilds.map(
                guild => html`
                  <tr
                    class=${css.guildsRankElement}
                    style=${guild.actual_war_id ? 'color: red' : ''}
                    id="guild-element"
                    title=${guild.name}
                  >
                    <td>${guild.rank}</td>
                    <td>${guild.name}</td>
                    <td>${guild.anagram}</td>
                    <td>${guild.points}</td>
                  </tr>
                `
              )
            : ''
        }
      </table>
    </div>
  </div>
`

function is_officer(user, guild) {
  if (user.id == guild.owner_id) return 2
  if (
    guild.officers_id &&
    guild.officers_id.findIndex(officer => {
      return officer == user.id
    }) >= 0
  )
    return 1
  return 0
}

function datetime_to_string(time) {
  return (
    time.split('-')[2].split('T')[0] +
    ' ' +
    time.split('-')[1] +
    ' ' +
    time.split('-')[0]
  )
}

export default class GuildView extends Backbone.View {
  constructor(args = {}) {
    super({
      events: {
        'click button#create-guild': 'create_guild',
        'click button#delete-guild': 'delete_guild',
        'click #guild-element': 'select_guild',
        'click #add-guild-member': 'add_member',
        'click #banne-guild-member': 'ban_member',
        'click #promote-guild-member': 'promote_member',
        'click #war-guild-member': 'resizeWarView',
        'click #quit-guild': 'quit_guild',
        'click #cnBackWar': 'cnBackWar',
        'click #SendNewWar': 'sendNewWar',
        'click #lineRequestWar': 'lineRequestWar',
        'click #linePendingWar': 'linePendingWar',
        'click #lineNextWarWar': 'lineNextWarWar',
        'click #acceptWarRequest': 'acceptWarRequest',
        'click #declineWarRequest': 'declineWarRequest',
        'click #cancelWarPending': 'cancelWarPending',
        'click #abandonWarNextWar': 'abandonWarNextWar',
        'click #abandonWarActualWar': 'abandonWarActualWar',
        keyup: 'keyaction'
      },
      ...args
    })
    this.name = 'Guilds'
    this.guilds = false
    this.userGuild = false
    this.userGuild_members = false
    this.guildSelected = false
    this.pendingWars = []
    this.requestWars = []
    this.nextWars = []
    this.history_wars = []
    this.actual_war = false
  }
  remove() {
    this.undelegateEvents()
  }
  reload() {
    this.guilds = false
    this.userGuild = false
    this.userGuild_members = false
    this.guildSelected = false
    this.pendingWars = []
    this.requestWars = []
    this.nextWars = []
    this.history_wars = []
    this.actual_war = false
    this.render()
  }
  async render() {
    this.wars = await new WarModel().fetch().promise()
    this.guilds = await new GuildModel().fetch().promise()
    if (currentUser().guild_id) {
      this.userGuild = this.guilds.filter(
        guild => guild.id == currentUser().guild_id
      )[0]
      let notStartedWars = this.wars.filter(
        war => this.userGuild.wars_id.filter(id => id == war.id).length == 1
      )
      this.nextWars = notStartedWars.filter(war => war.pending == false)
      this.pendingWars = notStartedWars.filter(
        war => war.guild1 == this.userGuild.name && war.pending
      )
      this.requestWars = notStartedWars.filter(
        war => war.guild2 == this.userGuild.name && war.pending
      )
      this.history_wars = this.wars.filter(war =>
        this.userGuild.history_wars_id.includes(war.id)
      )
      if (this.userGuild.actual_war_id)
        this.actual_war = this.wars.filter(
          war => war.id == this.userGuild.actual_war_id
        )[0]
      await this.getGuildMembers()
    }

    render(
      template({
        user: currentUser(),
        guildSelected: this.guildSelected,
        userGuild: this.userGuild,
        userGuild_members: this.userGuild_members,
        guilds: this.guilds,
        pendingWars: this.pendingWars,
        requestWars: this.requestWars,
        nextWars: this.nextWars,
        historyWars: this.history_wars,
        actualWar: this.actual_war
      }),
      this.el
    )
  }

  cnBackWar() {
    document.getElementById('checkboxWar').checked = false
    document.getElementById('radioWarUnchecked').checked = true
    document.getElementById('displayErrorAcceptWar').style.display = 'none'
    let radios = document.getElementsByName('radioRequestWar')
    for (let i = 0; i < radios.length; i++) {
      radios[i].checked = false
      document.getElementById(
        'rulesRequestWar' + radios[i].value
      ).style.display = 'none'
      document.getElementById(
        'nameGuildRequestWar' + radios[i].value
      ).style.color = 'black'
      document.getElementById(
        'nameGuildRequestWar' + radios[i].value
      ).style.background = 'white'
    }
    document.getElementById('buttonRequestWar').style.display = 'none'
    radios = document.getElementsByName('radioPendingWar')
    for (let i = 0; i < radios.length; i++) {
      radios[i].checked = false
      document.getElementById(
        'rulesPendingWar' + radios[i].value
      ).style.display = 'none'
      document.getElementById(
        'nameGuildPendingWar' + radios[i].value
      ).style.color = 'black'
      document.getElementById(
        'nameGuildPendingWar' + radios[i].value
      ).style.background = 'white'
    }
    document.getElementById('buttonNextWarWar').style.display = 'none'
    radios = document.getElementsByName('radioNextWarWar')
    for (let i = 0; i < radios.length; i++) {
      radios[i].checked = false
      document.getElementById(
        'rulesNextWarWar' + radios[i].value
      ).style.display = 'none'
      document.getElementById(
        'nameGuildNextWarWar' + radios[i].value
      ).style.color = 'black'
      document.getElementById(
        'nameGuildNextWarWar' + radios[i].value
      ).style.background = 'white'
    }
    document.getElementById('buttonNextWarWar').style.display = 'none'
  }

  async create_guild() {
    if (currentUser().guild_id) {
      this.render()
      return
    }
    const error = document.getElementById('divError')
    error.style.display = 'none'

    const name = document.getElementById('name-create-guild').value
    const anagram = document
      .getElementById('name-anagram-guild')
      .value.toUpperCase()

    if (!name) {
      document.getElementById('name-anagram-guild').value = anagram
      error.innerHTML = 'Please enter a name to create de guild'
      error.style.display = 'block'
      return
    }
    if (!anagram) {
      document.getElementById('name-anagram-guild').value = anagram
      error.innerHTML = 'Please enter a anagram to create de guild'
      error.style.display = 'block'
      return
    }
    if (this.guilds.filter(guild => guild.name == name).length > 0) {
      error.innerHTML = 'This name is already use by a guild'
      error.style.display = 'block'
      return
    }
    if (this.guilds.filter(guild => guild.anagram == anagram).length > 0) {
      error.innerHTML = 'This anagram is already use by a guild'
      error.style.display = 'block'
      return
    }
    if (anagram.length > 5 || anagram.length < 3) {
      error.innerHTML = 'Anagram must write between 3 and 5 characters'
      error.style.display = 'block'
      return
    }
    document.getElementById('name-create-guild').value = ''
    document.getElementById('name-anagram-guild').value = ''
    const guild = await new GuildModel({ name, anagram }).save().promise()
    await updateUser(true)
    this.userGuild = guild
    this.reload()
  }
  async delete_guild() {
    document.getElementById('divError').display = 'none'
    if (this.guildSelected == this.userGuild) this.guildSelected = false
    if (currentUser().id != this.userGuild.owner_id) {
      this.render()
      return
    }
    let guild = this.userGuild
    this.userGuild = false
    await new GuildModel(guild).destroy().promise()
    await updateUser(true)
    this.reload()
  }
  select_guild(e, value) {
    var idx = -1

    if (!value)
      idx = this.guilds.findIndex(guild => {
        return guild.name == e.currentTarget.title
      })
    else {
      idx = this.guilds.findIndex(guild => {
        return guild.name == value
      })
      if (idx == -1)
        idx = this.guilds.findIndex(guild => {
          return guild.anagram == value
        })
    }
    if (idx == -1) {
      this.guildSelected = false
      this.render()
      return
    }
    this.guildSelected = this.guilds[idx]
    new UserModel({ id: this.guildSelected.owner_id }).fetch().done(user => {
      this.guildSelected.owner = user.login

      this.guildSelected.warHistory = []
      this.cnt = 0
      for (var i = 0; i < this.guildSelected.history_wars_id.length; ++i) {
        new WarModel({ id: this.guildSelected.history_wars_id[i] })
          .fetch()
          .done(war => {
            ++this.cnt
            var idx = -1
            while (
              (idx = this.guildSelected.warHistory.findIndex(tmp_war => {
                return tmp_war.id == war.id
              })) != -1
            )
              this.guildSelected.warHistory.splice(idx, 1)

            this.guildSelected.warHistory.push(war)
            if (this.cnt >= this.guildSelected.history_wars_id.length) {
              this.guildSelected.warHistory.sort((a, b) => {
                a = new Date(a.start)
                b = new Date(b.start)
                if (a > b) return 1
                if (a < b) return -1
                return 0
              })
              this.render()
            }
          })
      }
      if (this.guildSelected.actual_war_id) {
        new WarModel({ id: this.guildSelected.actual_war_id })
          .fetch()
          .done(war => {
            this.guildSelected.actualWar = war
            this.render()
          })
      }
      this.render()
    })
  }
  async add_member() {
    const name = document.getElementById('user-guild').value
    const error = document.getElementById('divError')

    error.style.display = 'none'

    if (!name) {
      error.innerHTML = 'Please enter a name to add a new member'
      error.style.display = 'block'
      return
    }

    const users = await new UserModel().fetch().promise()

    if (users.filter(user => user.login == name).length == 0) {
      error.innerHTML = 'Sorry this user is not in the data base'
      error.style.display = 'block'
      return
    }

    const user = users.filter(usr => usr.login == name)[0]

    if (
      this.userGuild.members_id.filter(member_id => member_id == user.id)
        .length > 0
    ) {
      error.innerHTML = 'This user is already in your guild'
      error.style.display = 'block'
      return
    }

    if (user.guild_id) {
      error.innerHTML = 'This user is already in a guild'
      error.style.display = 'block'
      return
    }

    document.getElementById('user-guild').value = ''

    await new GuildAddMemberModel({
      login: name,
      guild: this.userGuild.id
    })
      .save()
      .promise()
    this.reload()
  }
  async ban_member() {
    const error = document.getElementById('divError')
    error.style.display = 'none'

    const login = document.getElementById('user-guild').value
    document.getElementById('user-guild').value = ''

    document.getElementById('divError').display = 'none'

    const users = await new UserModel().fetch().promise()

    if (users.filter(user => user.login == login).length == 0) {
      error.innerHTML = 'Sorry this user is not in the data base'
      error.style.display = 'block'
      return
    }

    const user = users.filter(usr => usr.login == login)[0]
    if (
      this.userGuild.members_id.filter(member_id => member_id == user.id)
        .length == 0
    ) {
      error.innerHTML = 'This user is not in your guild'
      error.style.display = 'block'
      return
    }

    if (user.id == this.userGuild.owner_id) {
      error.innerHTML = "You can't ban the owner"
      error.style.display = 'block'
      return
    }

    await new GuildBanMemberModel({
      guild_id: this.userGuild.id,
      login
    })
      .save()
      .promise()

    await updateUser(true)
    this.reload()
  }
  async promote_member() {
    var login = document.getElementById('user-guild').value
    document.getElementById('user-guild').value = ''

    const error = document.getElementById('divError')
    error.style.display = 'none'

    const users = await new UserModel().fetch().promise()

    if (users.filter(user => user.login == login).length == 0) {
      error.innerHTML = 'Sorry this user is not in the data base'
      error.style.display = 'block'
      return
    }

    const user = users.filter(usr => usr.login == login)[0]

    if (
      this.userGuild.members_id.filter(member_id => member_id == user.id)
        .length == 0
    ) {
      error.innerHTML = 'This user is not in your guild'
      error.style.display = 'block'
      return
    }

    if (user.id == this.userGuild.owner_id) {
      error.innerHTML = "You can't promote the owner"
      error.style.display = 'block'
      return
    }

    await new GuildPromoteMemberModel({ guild_id: this.userGuild.id, login })
      .save()
      .promise()
    this.reload()
  }
  async quit_guild() {
    document.getElementById('divError').display = 'none'
    if (currentUser().login == this.userGuild.owner) {
      this.render()
      return
    }
    await new GuildQuitModel().save().promise()
    await updateUser(true)
    this.reload()
  }
  async getGuildMembers() {
    const userGuild_members = []
    if (!this.userGuild.members_id || this.userGuild.members_id.length == 0) {
      return
    }
    let usr
    for (let i = 0; i < this.userGuild.members_id.length; i++) {
      usr = await new UserModel({ id: this.userGuild.members_id[i] })
        .fetch()
        .promise()
      userGuild_members.push(usr)
    }
    userGuild_members.sort((a, b) => {
      var grade_a = is_officer(a, this.userGuild)
      var grade_b = is_officer(b, this.userGuild)
      if (grade_a > grade_b) return -1
      else if (grade_a < grade_b) return 1
      return a.login.localeCompare(b.login)
    })

    this.userGuild_members = userGuild_members
  }
  keyaction(e) {
    var code = e.keyCode || e.witch
    if (e.target.id == 'search-guild' && code == 13) {
      this.select_guild(e, e.target.value)
      e.target.value = ''
    }
  }

  resizeWarView() {
    document.getElementById('containerSettingsWar').style.width =
      document.getElementById('content-guild-colonne').offsetWidth * 2 + 'px'
  }

  // async start_war() {
  //   document.getElementById('containerSettingsWar').style.width =
  //     document.getElementById('content-guild-colonne').offsetWidth * 2 + 'px'
  //   let guild = this.guilds.filter(el => el.name == 'poupou')[0]
  //   // let newWar = await new WarModel().fetch().promise()
  //   let wars = await new WarModel().fetch().promise()
  //   const war = await new WarModel().save().done()

  //   this.reload()
  // }

  async sendNewWar() {
    var error = document.getElementById('displayErrorNewWar')
    error.style.display = 'none'

    function getDate(s) {
      let date
      if (s == 'begin') {
        date = document.getElementById('dateCreateWarBegin').value
      } else if (s == 'end') {
        date = document.getElementById('dateCreateWarEnd').value
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

    function getDateWarTime(s, warBegin) {
      let date
      if (s == 'begin') {
        date = document.getElementById('dateCreateWarTimeBegin').value
      } else if (s == 'end') {
        date = document.getElementById('dateCreateWarTimeEnd').value
      }
      const [hr, mn] = date.split(':')
      return dayjs(warBegin)
        .set('hour', hr)
        .set('minute', mn)
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

    let guild = document.getElementById('nameOfGuildWar').value
    if (guild == '') {
      error.innerHTML = 'Enter a name of guild'
      error.style.display = 'block'
      return
    }
    if (guild == this.userGuild.name) {
      error.innerHTML = "You can't send a request at your guild"
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

    const dateBegin = dayjs(getDate('begin'))
    const dateEnd = dayjs(getDate('end'))
    const dateWarTimeBegin = dayjs(getDateWarTime('begin', dateBegin))
    const dateWarTimeEnd = dayjs(getDateWarTime('end', dateBegin))
    // return
    const today = dayjs(new Date())

    if (!dateBegin.isValid()) {
      error.innerHTML = 'Please enter a valid start date'
      error.style.display = 'block'
      return
    }
    if (dateBegin.isBefore(today)) {
      error.innerHTML = 'The start date cannot be passed'
      error.style.display = 'block'
      return
    }
    if (!dateEnd.isValid()) {
      error.innerHTML = 'Please enter a valid end date'
      error.style.display = 'block'
      return
    }
    if (dateEnd.isBefore(dateBegin)) {
      error.innerHTML = 'The end date cannot be before the start date'
      error.style.display = 'block'
      return
    }

    let prize = document.getElementById('chooseWarPrize').options
    for (let i = 0; i < prize.length; i++) {
      if (prize[i].selected) {
        prize = prize[i].value
        break
      }
    }
    let matchMaxWithoutResponse = document.getElementById(
      'chooseWarMaxMatchWithoutResponse'
    ).options
    for (let i = 0; i < matchMaxWithoutResponse.length; i++) {
      if (matchMaxWithoutResponse[i].selected) {
        matchMaxWithoutResponse = matchMaxWithoutResponse[i].value
        break
      }
    }

    const maxScore = getMaxScore()
    const bonus = getBonus()

    await new WarNewModel({
      guild_name: guild[0].name,
      start: dateBegin,
      end: dateEnd,
      warTimeBegin: dateWarTimeBegin,
      warTimeEnd: dateWarTimeEnd,
      end: dateEnd,
      bonus,
      matchs_max_without_response: matchMaxWithoutResponse,
      maxScore,
      prize,
      all_matchs_count: document.getElementById('allMatchsCountWar').checked
    })
      .save()
      .fail(() => {
        error.innerHTML = "Error: the war can't be created"
        error.style.display = 'block'
      })
      .promise()
    document.getElementById('dateCreateWarTimeBegin').value = ''
    document.getElementById('dateCreateWarTimeEnd').value = ''
    document.getElementById('dateCreateWarBegin').value = ''
    document.getElementById('dateCreateWarEnd').value = ''
    document.getElementById('radioMaxScore5').checked = true
    document.getElementById('radioBonusDefault').checked = true
    document.getElementById('nameOfGuildWar').value = ''
    document.getElementById('radioPendingWar').checked = true

    this.reload()
  }
  updateLineRequestWarView() {
    let radios = document.getElementsByName('radioRequestWar')
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked == false) {
        document.getElementById(
          'rulesRequestWar' + radios[i].value
        ).style.display = 'none'
        document.getElementById(
          'nameGuildRequestWar' + radios[i].value
        ).style.color = 'black'
        document.getElementById(
          'nameGuildRequestWar' + radios[i].value
        ).style.background = 'white'
      }
    }
  }
  lineRequestWar(e) {
    document.getElementById('displayErrorAcceptWar').style.display = 'none'
    document.getElementById('buttonRequestWar').style.display = 'block'
    // rulesRequestWar
    const warid = e.currentTarget.getAttribute('data-warid')
    document.getElementById('radioRequestWar' + warid).checked = true
    this.updateLineRequestWarView()
    document.getElementById('rulesRequestWar' + warid).style.display = 'block'
    document.getElementById('rulesRequestWar' + warid).style.display = 'block'
    document.getElementById('nameGuildRequestWar' + warid).style.background =
      'rgba(0,0,0,0.4)'
    document.getElementById('nameGuildRequestWar' + warid).style.color = 'white'
    this.render()
  }
  updateLinePendingWarView() {
    let radios = document.getElementsByName('radioPendingWar')
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked == false) {
        document.getElementById(
          'rulesPendingWar' + radios[i].value
        ).style.display = 'none'
        document.getElementById(
          'nameGuildPendingWar' + radios[i].value
        ).style.color = 'black'
        document.getElementById(
          'nameGuildPendingWar' + radios[i].value
        ).style.background = 'white'
      }
    }
  }
  linePendingWar(e) {
    document.getElementById('displayErrorAcceptWar').style.display = 'none'
    document.getElementById('buttonPendingWar').style.display = 'block'
    // rulesPendingWar
    const warid = e.currentTarget.getAttribute('data-warid')
    document.getElementById('radioPendingWar' + warid).checked = true
    this.updateLinePendingWarView()
    document.getElementById('rulesPendingWar' + warid).style.display = 'block'
    document.getElementById('rulesPendingWar' + warid).style.display = 'block'
    document.getElementById('nameGuildPendingWar' + warid).style.background =
      'rgba(0,0,0,0.4)'
    document.getElementById('nameGuildPendingWar' + warid).style.color = 'white'
    this.render()
  }
  updateLineNextWarWarView() {
    let radios = document.getElementsByName('radioNextWarWar')
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked == false) {
        document.getElementById(
          'rulesNextWarWar' + radios[i].value
        ).style.display = 'none'
        document.getElementById(
          'nameGuildNextWarWar' + radios[i].value
        ).style.color = 'black'
        document.getElementById(
          'nameGuildNextWarWar' + radios[i].value
        ).style.background = 'white'
      }
    }
  }
  lineNextWarWar(e) {
    document.getElementById('displayErrorAcceptWar').style.display = 'none'
    document.getElementById('buttonNextWarWar').style.display = 'block'
    const warid = e.currentTarget.getAttribute('data-warid')
    document.getElementById('radioNextWarWar' + warid).checked = true
    this.updateLineNextWarWarView()
    document.getElementById('rulesNextWarWar' + warid).style.display = 'block'
    document.getElementById('rulesNextWarWar' + warid).style.display = 'block'
    document.getElementById('nameGuildNextWarWar' + warid).style.background =
      'rgba(0,0,0,0.4)'
    document.getElementById('nameGuildNextWarWar' + warid).style.color = 'white'
    this.render()
  }
  async acceptWarRequest() {
    var error = document.getElementById('displayErrorAcceptWar')
    error.style.display = 'none'

    function getWarId() {
      const radios = document.getElementsByName('radioRequestWar')
      for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          return radios[i].value
        }
      }
    }

    async function checkWarDate(guild, war) {
      let warGuild = await new WarModel({ id: guild.actual_war_id })
        .fetch()
        .promise()
      let endWar = dayjs(war.end)
      let startWar = dayjs(war.start)
      let endWarGuild = dayjs(warGuild.end)
      let startWarGuild = dayjs(warGuild.start)
      if (
        (startWarGuild.isBefore(startWar) && endWarGuild.isAfter(startWar)) ||
        (startWarGuild.isBefore(endWar) && endWarGuild.isAfter(endWar))
      )
        return false
      for (let i = 0; i < guild.wars_id.length; i++) {
        warGuild = await new WarModel({ id: guild.wars_id[i] })
          .fetch()
          .promise()
        if (warGuild.pending == false) {
          endWar = dayjs(war.end)
          startWar = dayjs(war.start)
          endWarGuild = dayjs(warGuild.end)
          startWarGuild = dayjs(warGuild.start)
          {
            if (
              (startWarGuild.isBefore(startWar) &&
                endWarGuild.isAfter(startWar)) ||
              (startWarGuild.isBefore(endWar) && endWarGuild.isAfter(endWar))
            )
              return false
          }
        }
      }
    }
    const warId = getWarId()

    let war = await new WarModel({ id: warId }).fetch().promise()
    let res = await checkWarDate(this.userGuild, war)
    if (res == false) {
      error.innerHTML = 'You have already accepted a war at this date'
      error.style.display = 'block'
      return
    }
    const opponent = await new GuildModel({ id: war.guild1_id })
      .fetch()
      .promise()
    res = await checkWarDate(opponent, war)
    if (res == false) {
      error.innerHTML = 'Your opponent have already accepted a war at this date'
      error.style.display = 'block'
      return
    }

    await new WarAcceptModel({ war_id: warId }).save().promise()
    document.getElementById('radioRequestWar' + warId).checked = false
    document.getElementById('buttonRequestWar').style.display = 'none'
    this.updateLineRequestWarView()
    this.render()
  }
  async cancelWarPending() {
    function getWarId() {
      const radios = document.getElementsByName('radioPendingWar')
      for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          return radios[i].value
        }
      }
    }

    const warId = getWarId()
    await new WarCancelModel({ war_id: warId }).save().promise()

    document.getElementById('radioPendingWar' + warId).checked = false
    document.getElementById('buttonPendingWar').style.display = 'none'
    this.updateLinePendingWarView()
    this.render()
  }
  async declineWarRequest() {
    function getWarId() {
      const radios = document.getElementsByName('radioRequestWar')
      for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          return radios[i].value
        }
      }
    }

    const warId = getWarId()
    await new WarDeclineModel({ war_id: warId }).save().promise()

    document.getElementById('radioRequestWar' + warId).checked = false
    document.getElementById('buttonRequestWar').style.display = 'none'
    this.updateLineRequestWarView()
    this.render()
  }
  async abandonWarNextWar() {
    function getWarId() {
      const radios = document.getElementsByName('radioNextWarWar')
      for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          return radios[i].value
        }
      }
    }

    const warId = getWarId()
    const today = dayjs(new Date())

    let war = await new WarModel({ id: warId }).fetch().promise()
    const opponent_id =
      war.guild1_id == this.userGuild.id ? war.guild2_id : war.guild1_id
    let opponent = await new GuildModel({ id: opponent_id }).fetch().promise()
    opponent.points += war.prize
    this.userGuild.points -= war.prize
    this.userGuild.wars_id = this.userGuild.wars_id.filter(id => id != warId)
    opponent.wars_id = opponent.wars_id.filter(id => id != warId)
    this.userGuild.history_wars_id.push(war.id)
    opponent.history_wars_id.push(war.id)
    war.start = today
    war.end = today
    war.winner = opponent.name == war.guild1.name ? 2 : 1

    await new WarAbandonModel({ war_id: warId }).save().promise()

    document.getElementById('radioNextWarWar' + warId).checked = false
    document.getElementById('buttonNextWarWar').style.display = 'none'
    this.updateLineNextWarWarView()
    this.render()
  }
  async abandonWarActualWar() {
    const warId = this.userGuild.actual_war_id
    const today = dayjs(new Date())

    let war = await new WarModel({ id: warId }).fetch().promise()

    const opponent_id =
      war.guild1_id == this.userGuild.id ? war.guild2_id : war.guild1_id
    let opponent = await new GuildModel({ id: opponent_id }).fetch().promise()
    opponent.points += war.prize
    this.userGuild.points -= war.prize
    opponent.actual_war_id = null
    this.userGuild.actual_war_id = null
    this.userGuild.history_wars_id.push(war.id)
    opponent.history_wars_id.push(war.id)
    war.end = today
    war.winner = opponent.name == war.guild1.name ? 2 : 1

    await new WarAbandonModel({ war_id: warId }).save().promise()

    this.render()
  }
}
