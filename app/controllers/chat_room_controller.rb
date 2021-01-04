class ChatRoomController < ApplicationController

  # PUT /chat_room/join/:id
  def join
    room = ChatRoom.find(params[:id])
    if room.name == "World"
      json_response({ :error => 'Cannot join World' }, :bad_request)
      return
    end

    if !current_user.admin
      if room.private
        json_response({ :error => 'The room is private' }, :forbidden)
        return
      end

      if room.chat_room_mutes.where(ban: true, user_id: current_user.id).where('"end" is null or "end" > ?', Time.now).any?
        json_response({ :error => 'You are banned' }, :forbidden)
        return
      end

      if room.password_digest && !room.authenticate(params[:password])
        json_response({ :error => 'Wrong password' }, :forbidden)
        return
      end

    end

    current_user.chat_rooms.push(room) unless current_user.chat_rooms.include?(room)
    json_response :ok => true
  end

  # GET /chat_room/joined
  def joined
    json_response :rooms => current_user.chat_rooms
  end

  # GET /chat_room/joinable
  def joinable
    if current_user.admin
      rooms = ChatRoom.all
    else
      rooms = ChatRoom.where(private: false, is_dm_channel: false, is_game_channel: false).all
    end
    json_response :rooms => rooms
  end

  # PUT /chat_room/leave/:id
  def leave
    room = ChatRoom.find_by(id: params[:id])
    return if !room

    if room.name == "World"
      json_response({ :error => 'Cannot leave World' }, :bad_request)
      return
    end

    room.user_ids = room.user_ids - [current_user.id]

    room.destroy if room.users.empty?

    if !room.users.empty? && !room.is_dm_channel && !room.is_game_channel && room.owner_id == current_user.id
      admins = room.chat_room_admins.order('random()')
      if !admins.empty?
        room.owner_id = admins.first.user_id
      else
        room.owner_id = room.users.order('random()').first.id if admins.empty?
      end
    end

    room.save! if !room.users.empty?

    json_response :ok => true
  end

  # POST /chat_room/invite
  def invite
    room = ChatRoom.find(params[:room_id])
    if room.owner_id != current_user.id
      json_response({ :error => 'You must be the room owner' }, :forbidden)
      return
    end

    player = User.find_by(login: params[:login])
    player.chat_rooms.push(room)

    ActionCable.server.broadcast "notifications_#{player.id}", {
      :notification => "chat_room_invite",
      :room => room,
    }
    json_response room
  end

  # POST /chat_room/change_password
  def change_password
    room = ChatRoom.find(params[:room_id])
    if room.owner_id != current_user.id
      json_response({ :error => 'You must be the room owner' }, :forbidden)
      return
    end

    room.password = params[:password]
    room.save!

    json_response room
  end

  # POST /chat_room/toggle_admin
  def toggle_admin
    room = ChatRoom.find(params[:room_id])
    if room.owner_id != current_user.id
      json_response({ :error => 'You must be the room owner' }, :forbidden)
      return
    end

    user = User.find_by(login: params[:login])

    array = ChatRoomAdmin.where(user_id: user.id, chat_room_id: room.id).all
    if array.length > 0
      ChatRoomAdmin.delete(array)
    else
      ChatRoomAdmin.create(user_id: user.id, chat_room_id: room.id).save!
    end
  end

  # POST /chat_room/mute
  def mute
    room = ChatRoom.find(params[:room_id])
    if room.owner_id != current_user.id && !room.chat_room_admins.where(user_id: current_user.id).any?
      json_response({ :error => 'You must be a room admin' }, :forbidden)
      return
    end

    user = User.find_by(login: params[:login])

    array = ChatRoomMute.where(user_id: user.id, chat_room_id: room.id, ban: params[:ban])
      .where('"end" is null or "end" > ?', Time.now)
      .all
    if array.length > 0
      ChatRoomMute.delete(array)
    else
      ChatRoomMute.create(user_id: user.id, chat_room_id: room.id, ban: params[:ban], end: params[:end]).save!

      if params[:ban]
        room.user_ids = room.user_ids - [user.id]
        room.save!
        ActionCable.server.broadcast "notifications_#{user.id}", {
          :notification => "you_are_banned_room",
          :room => room,
        }
      end
    end
  end

  # POST /chat_room/new
  def create
    room = ChatRoom.create(
      :name => params[:name],
      :password => params[:password], # nil = no password
      :private => params[:password] ? false : params[:private], # nil = no password
      :owner_id => current_user.id,
      :is_dm_channel => false,
    )
    current_user.chat_rooms.push(room)
    json_response :room => room
  end

  # POST /chat_room/direct_message
  def direct_message
    other_user = User.find(params[:user_id])

    room = ChatRoom.where(is_dm_channel: true)
      .where(
        '(dm_player1_id = ? and dm_player2_id = ?) or (dm_player1_id = ? and dm_player2_id = ?)',
        current_user.id,
        other_user.id,
        other_user.id,
        current_user.id,
      )
      .first

    if !room
      room = ChatRoom.create(
        :name => "DM #{current_user.login} <=> #{other_user.login}",
        :password => nil,
        :owner_id => nil,
        :is_dm_channel => true,
        :dm_player1_id => other_user.id,
        :dm_player2_id => current_user.id,
      )
      room.save!
    end

    ActionCable.server.broadcast "notifications_#{current_user.id}", {
      :notification => "direct_message",
      :room => room,
    }

    json_response room
  end

end
