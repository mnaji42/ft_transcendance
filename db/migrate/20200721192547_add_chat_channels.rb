class AddChatChannels < ActiveRecord::Migration[6.0]
  def change
    create_table :chat_messages do |t|
      t.belongs_to :user
      t.belongs_to :chat_room
      t.string :content
      t.string :avatar_url
      t.string :author_name
      t.datetime :date
    end
    create_table :chat_rooms do |t|
      t.string :name
    end
  end
end
