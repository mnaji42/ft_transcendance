import Backbone from 'backbone'
import { html, render } from 'lit-html'

import css from '../styles/chat'

const template = ({}) => html` <ul class=${css.compact}></ul> `

export default class ChatCompactView extends Backbone.View {
  render() {
    render(template({}), this.el)
  }

  remove() {
    super.undelegateEvents()
  }
}
