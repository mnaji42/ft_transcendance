class ChatRoom < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  has_many :chat_messages, dependent: :destroy
  has_and_belongs_to_many :users
  belongs_to :owner, class_name: 'User', optional: true
  belongs_to :game, optional: true
  has_secure_password validations: false
  has_many :chat_room_admins
  has_many :chat_room_mutes

  def protected
    !password_digest.nil?
  end

  def as_json(options={})
    super(:only => [
      :id,
      :name,
      :owner_id,
      :dm_player1_id,
      :dm_player2_id,
      :is_dm_channel,
      :is_game_channel,
      :game_id,
      :private,
    ], :methods => :protected)
  end
end
