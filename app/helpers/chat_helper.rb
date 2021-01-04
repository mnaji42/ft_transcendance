module ChatHelper
  def ChatHelper.allowed?(user, room)
    return true if room.name == "World"

    return room.dm_player1_id == user.id || room.dm_player2_id == user.id if room.is_dm_channel
    
    return user.chat_rooms.include?(room)
  end
end
