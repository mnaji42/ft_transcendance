class AddChatRoomAdmins < ActiveRecord::Migration[6.0]
  def change
    create_table :chat_room_admins do |t|
      t.belongs_to :chat_room
      t.belongs_to :user
    end
  end
end
