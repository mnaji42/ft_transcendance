import CurrentUserModel from './models/CurrentUserModel'
import DisconnectModel from './models/DisconnectModel'
import Backbone from 'backbone'

let _currentUser
let _router

export default function get() {
  return _currentUser
}

export async function update(update = false, router = null) {
  if (router) _router = router
  const val = await new CurrentUserModel().fetch().promise()
  _currentUser = val
  if (update) await _router.userUpdated()
  return val
}

export async function disconnect() {
  await new DisconnectModel().save().promise()
  _currentUser = null
  Backbone.history.navigate('/?disconnected', { trigger: true })
}
