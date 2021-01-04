class AddGameChatRooms < ActiveRecord::Migration[6.0]
  def change
    add_column :chat_rooms, :is_game_channel, :boolean, default: false
    add_column :chat_rooms, :game_id, :bigint
  end
end
