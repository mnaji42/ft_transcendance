import 'core-js/stable'
import 'regenerator-runtime/runtime'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)

import { history } from 'backbone'
import router from './router.js'

import $ from 'jquery'

window.$ = $

// open <a> tags by pushing the state
$(document).on('click', 'a:not([data-bypass])', function (event) {
  const href = { prop: $(this).prop('href'), attr: $(this).attr('href') }
  const root = location.protocol + '//' + location.host + history.options.root

  if (href.prop && href.prop.slice(0, root.length) === root) {
    event.preventDefault()
    history.navigate(href.attr, true)
  }
})

// jquery deferred exceptions are dumb
$.Deferred.exceptionHook = function (e) {
  console.log(e)
}

window.addEventListener('load', () => {
  router.init()
})

window.addEventListener('unhandledrejection', event => {
  console.warn(`unhandled promise rejection: ${event.reason}`)
})
