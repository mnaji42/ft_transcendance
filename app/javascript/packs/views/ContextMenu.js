
app.views.ContextMenu = Backbone.View.extend({
  events: {
    'click button.chat-collapse': 'chat_collapse'
  },
  initialize() {
  },
  render(content, { width, height }) {
    const offset = this.target.offset()

    this.$el.html(content)
    this.$el.css('left', offset.left + 'px')
    this.$el.css('top',
      offset.top + this.target.height() + 'px')
    this.$el.css('width', width)
    this.$el.css('height', height)
  },
  configure(target, content, size) {
    this.target = target
    this.render(content, size)
  }
})
