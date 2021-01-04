class ChatRoomsCanBeJoined < ActiveRecord::Migration[6.0]
  def change
    add_reference :chat_rooms, :owner, index: true
    add_column :chat_rooms, :password_digest, :string
    create_join_table :users, :chat_rooms
  end
end
