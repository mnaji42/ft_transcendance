class AddChatRoomMutesAndBans < ActiveRecord::Migration[6.0]
  def change
    create_table :chat_room_mutes do |t|
      t.belongs_to :chat_room
      t.belongs_to :user
      t.boolean :ban
      t.datetime :end
    end
  end
end
