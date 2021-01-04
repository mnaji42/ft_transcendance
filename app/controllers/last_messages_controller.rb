class LastMessagesController < ApplicationController

  # GET /last_messages/:id
  def get
    room = ChatRoom.find(params[:id])
    unless room
      json_response({ :error => 'Cannot find this chat room!' }, :not_found)
      return
    end

    unless ChatHelper.allowed?(current_user, room)
      json_response({ :error => 'You must join this chat room first!' }, :forbidden)
      return
    end

    messages = room.chat_messages.order(date: :desc).limit(500).reverse
    json_response :messages => messages
  end

end
