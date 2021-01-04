class AdminController < ApplicationController
  before_action :require_admin

  # POST /admin/chat_join
  def chat_join
    room = ChatRoom.find_by(name: params[:name])
    if !room
      json_response({ :error => 'Chat room does not exist' }, :not_found)
      return
    end

    current_user.chat_rooms.push(room) unless current_user.chat_rooms.include?(room)
  end

  # POST /admin/chat_delete
  def chat_delete
    room = ChatRoom.find_by(name: params[:name])
    if !room
      json_response({ :error => 'Chat room does not exist' }, :not_found)
      return
    end

    room.users.each do |user|
      ActionCable.server.broadcast "notifications_#{user.id}", {
        :notification => "you_are_banned_chat",
        :room => room,
      }
    end

    room.delete
  end

  # POST /admin/chat_demote
  def chat_demote
    room = ChatRoom.find_by(name: params[:chat])
    user = User.find_by(displayname: params[:displayname])
    if !room
      json_response({ :error => 'Chat room does not exist' }, :not_found)
      return
    end
    if !user
      json_response({ :error => 'User does not exist' }, :not_found)
      return
    end

    ChatRoomAdmin.delete(ChatRoomAdmin.where(user_id: user.id, chat_room_id: room.id).all)
  end

  # POST /admin/chat_promote
  def chat_promote
    room = ChatRoom.find_by(name: params[:chat])
    user = User.find_by(displayname: params[:displayname])
    if !room
      json_response({ :error => 'Chat room does not exist' }, :not_found)
      return
    end
    if !user
      json_response({ :error => 'User does not exist' }, :not_found)
      return
    end

    if !ChatRoomAdmin.where(user_id: user.id, chat_room_id: room.id).any?
      ChatRoomAdmin.create(user_id: user.id, chat_room_id: room.id).save!
    end
  end

  # POST /admin/user_ban
  def user_ban
    user = User.find_by(displayname: params[:displayname])
    if !user
      json_response({ :error => 'User does not exist' }, :not_found)
      return
    end
    ActionCable.server.broadcast "notifications_#{user.id}", {
      :notification => "you_are_banned",
    }

    RankHelper.recalculate

    user.banned = true
    user.save!
  end
end
