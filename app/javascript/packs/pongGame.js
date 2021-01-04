import socketConsumer from './socketConsumer'

export function pongGame(currentView, settings) {
  const spectating = settings.spectating // spectating is true when spectating!
  const offLine = settings.gameMode === 'OffLine'

  // document.getElementById('Replay').style.display = 'block'
  // if (settings.gameMode == 'DUEL')
  //   document.getElementById('Replay').style.display = 'none'

  // remove "searching" div
  if (!spectating)
    document.getElementById('searchOpponant').style.display = 'none'

  //------------ Display button ------------//
  //---------------------------------------------//

  const gameIsFinish = !spectating && document.getElementById('gameIsFinish')
  const inGame = !spectating && document.getElementById('inGame')
  const abandon = !spectating && document.getElementById('abandon')

  if (!spectating) currentView.gameStarted = offLine

  if (!spectating) {
    gameIsFinish.style.display = 'none'
    inGame.style.display = 'block'
    document.getElementById('chooseSettings').style.display = 'none'
  }

  //---------------- Init canvas -----------------//
  //---------------------------------------------//
  const canvas = spectating
    ? document.getElementById('spectateCanvas')
    : document.getElementById('pongGame')
  const context = canvas.getContext('2d')

  canvas.style.display = 'block'

  const canvasHeight =
    !spectating && document.getElementById('colonePongGame').offsetWidth * 0.45

  let width = 300
  let height = 150

  //---------------- Init player -------------------//
  //-----------------------------------------------//

  // player1 est le joueur de gauche
  let player1 = {
    x: 5,
    y: height / 2 - 30 / 2,
    width: 5,
    height: 30,
    color: settings.map == 'MapBasket' ? 'black' : 'white',
    score: 0
  }

  //player2 est le joueur de droite
  let player2 = {
    x: width - 10,
    y: height / 2 - 30 / 2,
    width: 5,
    height: 30,
    color: settings.map == 'MapBasket' ? 'black' : 'white',
    score: 0
  }

  let ball = {
    x: width / 2,
    y: height / 2,
    radius: 3,
    speed: 0.5,
    speedX: 0.5,
    speedY: 0.5,
    color: settings.map == 'MapDefault' ? 'white' : 'black',
    pause: false
  }

  let barrier = null
  let ball2 = null

  let pause = false

  let interval

  //-------------- Init websocket ---------------//
  //---------------------------------------------//

  if (spectating && settings.finished) specGameEnd()

  if (!offLine && !(spectating && settings.finished)) {
    const gameChannel = socketConsumer.subscriptions.create(
      { channel: 'GameChannel', game_id: settings.gameId },
      {
        connected() {},
        disconnected() {},
        rejected() {},
        received(data) {
          currentView.gameStarted = true

          if (data.message === 'update') {
            // Update the game state
            const { state } = data

            width = state.width
            height = state.height
            player1 = {
              ...player1,
              x: state.player1.x,
              y:
                !spectating && settings.player == 1
                  ? player1.y
                  : state.player1.y,
              width: state.player1.width,
              height: state.player1.height,
              score: state.player1.score
            }
            player2 = {
              ...player2,
              x: state.player2.x,
              y:
                !spectating && settings.player == 2
                  ? player2.y
                  : state.player2.y,
              width: state.player2.width,
              height: state.player2.height,
              score: state.player2.score
            }
            ball = {
              ...ball,
              x: state.ball1.x,
              y: state.ball1.y,
              radius: state.ball1.radius,
              speed: state.ball1.speed,
              speedX: state.ball1.speed_x,
              speedY: state.ball1.speed_y,
              pause: state.ball1.pause
            }
            if (state.barrier)
              barrier = {
                ...barrier,
                x: state.barrier.x,
                y: state.barrier.y,
                width: state.barrier.width,
                height: state.barrier.height,
                speed: state.barrier.speed
              }
            if (state.ball2)
              ball2 = {
                ...ball2,
                x: state.ball2.x,
                y: state.ball2.y,
                radius: state.ball2.radius,
                speed: state.ball2.speed,
                speedX: state.ball2.speed_x,
                speedY: state.ball2.speed_y,
                pause: state.ball2.pause
              }
            ballOut1 = state.ball_out1
            ballOut2 = state.ball_out2
            pause = state.pause
          } else if (data.message === 'end') {
            // End of the game!
            gameChannel.unsubscribe()
          }
        }
      }
    )

    if (spectating) currentView.spectateChannel = gameChannel
    else currentView.gameChannel = gameChannel
  }

  // Si on est en mode training ou friend on check les settings :
  if (settings.gameMode == 'OffLine' || settings.gameMode == 'Friend') {
    if (settings.bonus == 'BonusBarrier') {
      barrier = {
        x: width / 2 - 2.5,
        y: 0,
        width: 5,
        height: 40,
        color: settings.map == 'MapBasket' ? 'black' : 'white',
        speed: 0.5
      }
    } else if (settings.bonus == 'BonusDoubleBall') {
      ball2 = {
        x: width / 2,
        y: height / 2,
        radius: 3,
        speed: -0.5,
        speedX: -0.5,
        speedY: -0.5,
        color: settings.map == 'MapDefault' ? 'white' : 'black',
        pause: false
      }
    }
    //On check le level de l'ia si on est en mode training
    if (settings.gameMode == 'OffLine') {
      if (settings.lvl == 'LvlNewb') {
        player2.speed = 0.4
      }
      if (settings.lvl == 'LvlPro') {
        player2.speed = 0.7
      }
      if (settings.lvl == 'LvlLegend') {
        player2.speed = 1
      }
    }
  }

  //---------------- Utils function ----------------//
  //-----------------------------------------------//

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async function makePause(ms) {
    pause = true
    await sleep(ms)
    pause = false
  }

  function drawRect(x, y, w, h, color) {
    context.fillStyle = color
    context.fillRect(x, y, w, h)
  }

  function drawBall(x, y, r, color) {
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, r, 0, Math.PI * 2, false)
    context.closePath()
    context.fill()
  }

  function drawText(text, x, y, color) {
    context.fillStyle = color
    context.font = '25px arial italic'
    context.fillText(text, x, y)
  }

  async function collisionPause(ball, ms) {
    ball.pause = true
    await sleep(ms)
    ball.pause = false
  }

  function collision(ball, player, x) {
    if (
      ball.x + ball.radius > player.x &&
      ball.y + ball.radius > player.y &&
      ball.x - ball.radius < player.x + player.width &&
      ball.y - ball.radius < player.y + player.height &&
      ball.pause == false
    ) {
      if (x != -1) ball.x = 2 * x - ball.x
      ball.speedX *= -1
      if (ball.y < player.y + player.height / 2)
        ball.speedY = ball.speedY > 0 ? ball.speedY + 0.1 : ball.speedY - 0.1
      else {
        ball.speedX = ball.speedX > 0 ? ball.speedX + 0.1 : ball.speedX - 0.1
      }
      collisionPause(ball, 100)
    }
  }

  function specGameEnd() {
    drawText('Game ended', width / 3, height / 2, map == 3 ? 'black' : 'white')
  }

  const mouseMove = event => {
    let rect = canvas.getBoundingClientRect()

    const newY =
      settings.player === 1
        ? (event.clientY - rect.top) / (canvasHeight / height) -
          player1.height / 2
        : (event.clientY - rect.top) / (canvasHeight / height) -
          player2.height / 2

    if (settings.player == 1) player1.y = newY
    else player2.y = newY

    if (!offLine && !spectating && currentView.gameChannel) {
      // Send new Y to the socket!
      currentView.gameChannel.send({ event: 'input', y: newY })
    }
  }

  if (!spectating) canvas.addEventListener('mousemove', mouseMove)

  // ballOut == 0 <=> la ball est toujours en jeu
  // ballOut == 1 <==> le joueur1 a rate la ball
  // ballOut == 2 <==> le joueur2 a rate la ball
  let ballOut1 = 0
  let ballOut2 = 0

  // Je cree un variable map pck j'ai l'impression que c plus rapide de
  // comparer des int que des strings
  let map = 1
  if (settings.map == 'MapSoccer') map = 2
  else if (settings.map == 'MapBasket') map = 3
  function drawGame() {
    if (map == 1) {
      drawRect(0, 0, width, height, 'black')
    } else if (map == 2) {
      drawRect(0, 0, width, height, '#29EC52')
      drawRect(1, height / 5, width / 10, 5, 'white')
      drawRect(1, (4 * height) / 5 - 10, width / 10, 5, 'white')
      drawRect(width / 10, height / 5, 5, (3 * height) / 5 - 5, 'white')
      drawRect(width - 1 - width / 10, height / 5, width / 10, 5, 'white')
      drawRect(
        width - 1 - width / 10,
        (4 * height) / 5 - 10,
        width / 10,
        5,
        'white'
      )
      drawRect(
        width - 1 - width / 10,
        height / 5,
        5,
        (3 * height) / 5 - 5,
        'white'
      )
    } else if (map == 3) {
      drawRect(0, 0, width, height, '#FB9641')
      drawRect(1, height / 3, width / 3, 5, 'white')
      drawRect(1, (2 * height) / 3 - 10, width / 3, 5, 'white')
      drawRect(width / 3, height / 3, 5, height / 3 - 5, 'white')
      drawRect(width - 1 - width / 3, height / 3, width / 3, 5, 'white')
      drawRect(
        width - 1 - width / 3,
        (2 * height) / 3 - 10,
        width / 3,
        5,
        'white'
      )
      drawRect(width - 1 - width / 3, height / 3, 5, height / 3 - 5, 'white')
    }

    for (let i = 10; i <= height; i += 25) {
      drawRect(width / 2 - 1, i, 2, 15, 'white')
    }

    drawText(player1.score, width / 2 - 25, 20, player1.color)
    drawText(player2.score, width / 2 + 15, 20, player1.color)

    drawRect(player1.x, player1.y, player1.width, player1.height, player1.color)
    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color)
    if (barrier)
      drawRect(
        barrier.x,
        barrier.y,
        barrier.width,
        barrier.height,
        player1.color
      )
    if (!ballOut1) drawBall(ball.x, ball.y, ball.radius, ball.color)
    if (ball2 && !ballOut2)
      drawBall(ball2.x, ball2.y, ball2.radius, ball2.color)
  }

  function IAmove() {
    if (!ball2 || ballOut2 || ball2.x < width / 2) {
      if (player2.y + player2.height / 2 < ball.y - ball.radius)
        player2.y += player2.speed
      else if (player2.y + player2.height / 2 > ball.y)
        player2.y -= player2.speed
    } else if (ballOut1 || ball.x < width / 2) {
      if (player2.y + player2.height / 2 < ball2.y - ball2.radius)
        player2.y += player2.speed
      else if (player2.y + player2.height / 2 > ball2.y)
        player2.y -= player2.speed
    }
  }

  function update() {
    if (!ballOut1) {
      ball.x += ball.speedX
      ball.y += ball.speedY
    }
    if (ball2 && !ballOut2) {
      ball2.x += ball2.speedX
      ball2.y += ball2.speedY
    }

    if (offLine) IAmove()
    else {
      if (settings.player == 1) {
        // player2 = position en y de l'autre joueur
      } else {
        // player1 = position en y de l'autre joueur
      }
    }

    // Si la ball touche le haut ou le bas du pong
    if (ball.y + ball.radius > height) {
      ball.y = 2 * height - ball.y
      ball.speedY = -ball.speedY
    } else if (ball.y - ball.radius < 0) {
      ball.y = -ball.y
      ball.speedY = -ball.speedY
    }
    if (ball2) {
      if (ball2.y + ball2.radius > height) {
        ball2.y = 2 * height - ball2.y
        ball2.speedY = -ball2.speedY
      } else if (ball2.y - ball2.radius < 0) {
        ball2.y = -ball2.y
        ball2.speedY = -ball2.speedY
      }
    }

    // On fait bouger la barrier si elle existe
    if (barrier) {
      barrier.y += barrier.speed
      if (
        barrier.y + barrier.height / 2 <= 0 ||
        barrier.y + barrier.height / 2 >= height
      ) {
        barrier.speed *= -1
      }
    }

    // debugger
    // On verifie la collision avec les joueurs ou la barriere
    collision(ball, player1, player1.x + player1.width)
    collision(ball, player2, player2.x)
    if (barrier && !ballOut1) collision(ball, barrier, -1)
    if (ball2) {
      collision(ball2, player1, player1.x + player1.width)
      collision(ball2, player2, player2.x)
      if (barrier && !ballOut2) collision(ball2, barrier, -1)
    }

    // On verifie si une des balles est sortie du terrains
    if (ball.x - ball.radius < 0) {
      ball.x = width / 2
      ball.y = height / 2
      ball.speedX = ball.speed
      ball.speedY = ball.speed
      ballOut1 = 1
      player2.score++
    } else if (ball.x + ball.radius > width) {
      ball.x = width / 2
      ball.y = height / 2
      ball.speedX = ball.speed
      ball.speedY = ball.speed
      ballOut1 = 2
      player1.score++
    }
    if (ball2 && ball2.x - ball2.radius < 0) {
      ball2.x = width / 2
      ball2.y = height / 2
      ball2.speedX = ball2.speed
      ball2.speedY = ball2.speed
      ballOut2 = 1
      player2.score++
    } else if (ball2 && ball2.x + ball2.radius > width) {
      ball2.x = width / 2
      ball2.y = height / 2
      ball2.speedX = ball2.speed
      ball2.speedY = ball2.speed
      ballOut2 = 2
      player1.score++
    }

    // Si il n'y a plus de ball sur le terrain on remet les balles en jeu
    if ((ballOut1 && !ball2) || (ballOut1 && ballOut2)) {
      ballOut1 = 0
      if (ball2) ballOut2 = 0
      if (barrier) barrier.y = 0
      makePause(1000)
    }
  }

  const loop = () => {
    if (offLine && pause == false) update()
    if (
      (!spectating &&
        (abandon.checked || currentView.loseGame) &&
        currentView.gameStarted) ||
      player1.score >= settings.maxScore ||
      player2.score >= settings.maxScore
    ) {
      currentView.loseGame = false
      clearInterval(interval)
      if (spectating) canvas.removeEventListener('mousemove', mouseMove)

      if (map == 1) drawRect(0, 0, width, height, 'black')
      else if (map == 2) drawRect(0, 0, width, height, '#29EC52')
      else if (map == 3) drawRect(0, 0, width, height, '#FB9641')

      if (
        !spectating &&
        (abandon.checked || currentView.loseGame) &&
        currentView.gameChannel
      ) {
        currentView.gameChannel.send({ event: 'giveup' })
        currentView.gameChannel.unsubscribe()
        currentView.gameChannel = null
      }

      if (!spectating) {
        if (
          ((settings.player == 1 && player1.score >= settings.maxScore) ||
            (settings.player == 2 && player2.score >= settings.maxScore)) &&
          !(abandon.checked || currentView.loseGame)
        )
          drawText(
            'You win',
            width / 3,
            height / 2,
            map == 3 ? 'black' : 'white'
          )
        else
          drawText(
            'You lose',
            width / 3,
            height / 2,
            map == 3 ? 'black' : 'white'
          )
      } else {
        drawText(
          player1.score >= settings.maxScore
            ? 'Player 1 wins'
            : 'Player 2 wins',
          width / 3,
          height / 2,
          map == 3 ? 'black' : 'white'
        )
      }

      if (!spectating) {
        abandon.checked = false
        inGame.style.display = 'none'
        gameIsFinish.style.display = 'block'
      }
    } else drawGame()
  }

  const framePerSecond = 250

  if (!(spectating && settings.finished)) {
    makePause(1000)
    interval = setInterval(loop, 1000 / framePerSecond)
    currentView.gameInterval = interval
  }
}
