class AddPrivateChatRooms < ActiveRecord::Migration[6.0]
  def change
    add_column :chat_rooms, :private, :boolean, default: false
  end
end
