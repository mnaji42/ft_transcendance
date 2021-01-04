Rails.application.routes.draw do

  scope :api do
    scope :v1 do

      get 'auth/url', to: 'auth#get_url'
      get 'me', to: 'auth#get'
      get 'auth/gauthQR', to: 'auth#gauthQR'
      post 'auth/setupGAuth', to: 'auth#setupGAuth'
      post 'auth/removeGAuth', to: 'auth#removeGAuth'
      post 'auth/validateGAuth', to: 'auth#validateGAuth'
      post 'auth/fake_connect', to: 'auth#fake_connect'
      post 'auth/disconnect', to: 'auth#disconnect'
      get 'last_messages/:id', to: 'last_messages#get'
      put 'chat_room/join/:id', to: 'chat_room#join'
      get 'chat_room/joined', to: 'chat_room#joined'
      get 'chat_room/joinable', to: 'chat_room#joinable'
      put 'chat_room/leave/:id', to: 'chat_room#leave'
      post 'chat_room/new', to: 'chat_room#create'
      post 'chat_room/direct_message', to: 'chat_room#direct_message'
      post 'chat_room/invite', to: 'chat_room#invite'
      post 'chat_room/change_password', to: 'chat_room#change_password'
      post 'chat_room/toggle_admin', to: 'chat_room#toggle_admin'
      post 'chat_room/mute', to: 'chat_room#mute'
      get 'tournament_games/joined', to: 'join_tournament#joined'
      post 'tournament_games/join', to: 'join_tournament#join'
      post 'tournament_games/leave', to: 'join_tournament#leave'
      post 'tournament_games/find', to: 'join_tournament#find'
      get 'match_history/:id', to: 'match_history#get'
      get 'block/is/:id', to: 'user_blocks#is'
      post 'block/add', to: 'user_blocks#add'
      post 'block/remove', to: 'user_blocks#remove'
      post 'defy/new', to: 'defy#new'
      post 'defy/accept', to: 'defy#accept'
      post 'war_defy/accept', to: 'defy#war_accept'
      post 'guild_manage/add_member', to: 'guild_manage#add_member'
      post 'guild_manage/ban_member', to: 'guild_manage#ban_member'
      post 'guild_manage/promote_member', to: 'guild_manage#promote_member'
      post 'guild_manage/quit', to: 'guild_manage#quit'
      post 'guild_manage/new_war', to: 'guild_manage#new_war'
      post 'guild_manage/accept_war', to: 'guild_manage#accept_war'
      post 'guild_manage/cancel_war', to: 'guild_manage#cancel_war'
      post 'guild_manage/decline_war', to: 'guild_manage#decline_war'
      post 'guild_manage/abandon_war', to: 'guild_manage#abandon_war'
      post 'friend/add', to: 'friend#add'
      post 'friend/remove', to: 'friend#remove'
      post 'admin/chat_join', to: 'admin#chat_join'
      post 'admin/chat_delete', to: 'admin#chat_delete'
      post 'admin/chat_demote', to: 'admin#chat_demote'
      post 'admin/chat_promote', to: 'admin#chat_promote'
      post 'admin/user_ban', to: 'admin#user_ban'

      resources :users
      resources :guilds
      resources :wars
      resources :tournaments
      resources :games

    end
  end

  get '/auth/callback', to: 'auth#callback'

  get '/2fa', to: 'frontend#index'
  get '/fakeconnect', to: 'frontend#index'
  get '/admin', to: 'frontend#index'
  get '/guilds', to: 'frontend#index'
  get '/friends', to: 'frontend#index'
  get '/profile/:id', to: 'frontend#index'
  root 'frontend#index'

end
