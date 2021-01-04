import Backbone from 'backbone'
import { html, render } from 'lit-html'

import socketConsumer from '../socketConsumer'

const template = ({ width, height }) => html`
  <canvas width=${width} height=${height}></canvas>
`

export default class LayoutView extends Backbone.View {
  constructor({ room, ...args }) {
    super({
      events: {},
      ...args
    })
    return

    this.width = 500
    this.height = 500

    this.render()

    this.ctx = this.$('canvas')
      .get(0)
      .getContext('2d')

    this.ctx.fillStyle = 'black'
    this.ctx.font = 'bold 16px Arial'
    this.ctx.fillText('Connecting...', this.width / 2 - 17, this.height / 2 + 8)

    this.subscription = socketConsumer.subscriptions.create(
      { channel: 'GameChannel', room },
      {
        received: ({ arena, ball, pad1, pad2, time, heartBeat }) => {
          this.arena = { width: arena.width, height: arena.height }

          this.ball = {
            x: ball.x,
            y: ball.y,
            vx: ball.vx,
            vy: ball.vy,
            size: ball.size
          }
          this.pad1 = { x: pad1.x, y: pad1.y, v: pad1.v, size: pad1.size }
          this.pad2 = { x: pad2.x, y: pad2.y, v: pad1.v, size: pad2.size }

          if (!this.interval) {
            this.interval = setInterval(() => this.tick(), 10)
          }

          // if (this.lastServerUpdate) {
          //   const factor = (time - this.lastServerUpdate.time) / heartBeat
          //   this.falseBallV = { vx: factor * ball.vx, vy: factor * ball.vy }
          // } else {
          //   this.falseBallV = { vx: ball.vx, vy: ball.vy }
          // }

          // this.lastServerUpdate = { time, ball }
          this.lastServerUpdate = time
          this.serverUpdated = true
        },
        disconnected: () => {
          this.destroy()
        }
      }
    )
  }
  destroy() {
    clearInterval(this.interval)
    this.subscription.unsubscribe()
  }
  render() {
    render(template({ width: this.width, height: this.height }), this.el)
  }
  drawBar(pad) {
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'rgba(0,0,0)'
    this.ctx.moveTo(pad.x - pad.size / 2, pad.y)
    this.ctx.lineTo(pad.x + pad.size / 2, pad.y)
    this.ctx.stroke()
  }
  draw() {
    // draw ball
    this.ctx.beginPath()
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2, true)
    this.ctx.stroke()

    this.drawBar(this.pad1)
    this.drawBar(this.pad2)
  }
  prediction(elapsed) {
    this.ball.x += elapsed * this.ball.vx
    this.ball.y += elapsed * this.ball.vy

    if (this.ball.x >= this.arena.width) {
      const overflow = this.ball.x - this.arena.width
      this.ball.vx = -this.ball.vx
      this.ball.x = this.arena.width - overflow
    }

    if (this.ball.x < 0) {
      const overflow = -this.ball.x
      this.ball.vx = -this.ball.vx
      this.ball.x = overflow
    }
  }
  tick() {
    // clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height)

    // client side prediction
    if (this.serverUpdated) {
      this.prediction(Date.now() - this.lastServerUpdate)
      this.serverUpdated = false
    } else {
      this.prediction(10)
    }

    // draw
    this.draw()
  }
}
