class AddDirectMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :chat_rooms, :dm_player1_id, :bigint
    add_column :chat_rooms, :dm_player2_id, :bigint
    add_column :chat_rooms, :is_dm_channel, :boolean, default: false
  end
end
