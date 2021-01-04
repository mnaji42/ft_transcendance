class ChatMessage < ApplicationRecord
  validates :content, presence: true
  validates :date, presence: true
  validates :author_name, presence: true
  belongs_to :chat_room
  belongs_to :user

  def as_json(options={})
    super(:only => [
      :id,
      :content,
      :author_name,
      :avatar_url,
      :date,
      :user_id,
      :chat_room_id,
      :guild_anagram,
    ])
  end
end
