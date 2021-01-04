class ChatChannel < ApplicationCable::Channel
  # Someone started listening to the channel
  def subscribed
    @room = ChatRoom.find(params[:room_id])

    unless ChatHelper.allowed?(current_user, @room)
      reject
      return
    end

    puts "#{current_user.displayname} joined #{params[:room_id]}!"
    stream_from "chat_#{params[:room_id]}"
  end

  # Someone stopped listening to the channel
  def unsubscribed
    puts "#{current_user.displayname} left!"
  end

  def receive(data)
    if data['content'].length < 1
      return
    end

    if @room.chat_room_mutes.where(ban: false, user_id: current_user.id).where('"end" is null or "end" > ?', Time.now).any?
      # Muted
      return
    end

    current_user.reload

    message = ChatMessage.create(
      content: data['content'][0..512],
      avatar_url: current_user.avatar_url,
      date: Time.now,
      chat_room_id: params[:room_id],
      user_id: current_user.id,
      author_name: current_user.displayname,
      guild_anagram: current_user.guild_anagram,
    )

    if @room.is_dm_channel

      if UserBlock.where(user_id: @room.dm_player1_id, blocked_id: current_user.id).none?
        ActionCable.server.broadcast "notifications_#{@room.dm_player1_id}", {
          :notification => "direct_message",
          :room => @room,
        }
      end
      if UserBlock.where(user_id: @room.dm_player2_id, blocked_id: current_user.id).none?
        ActionCable.server.broadcast "notifications_#{@room.dm_player2_id}", {
          :notification => "direct_message",
          :room => @room,
        }
      end

    end

    ActionCable.server.broadcast "chat_#{params[:room_id]}", message
  end
end
