class User < ApplicationRecord
  # Site data
  # validates :avatar_url, presence: true
  # validates :displayname, presence: true
  # validates :default_settings, presence: true

  # Tokens
  # validates :access_token, presence: true
  # validates :token_type, presence: true
  # validates :token_expire, presence: true
  # validates :refresh_token, presence: true
  # validates :token_scope, presence: true

  # Intra data
  # validates :intra_id, presence: true
  # validates :email, presence: true
  # validates :login, presence: true
  # validates :first_name, presence: true
  # validates :last_name, presence: true
  # validates :intra_url, presence: true
  # validates :intra_displayname, presence: true
  # validates :intra_image_url, presence: true
  # validates :is_intra_staff, presence: true

  # 2FA
  # validates :google_secret, presence: true
  # validates :mfa_enabled, presence: true

  ###
  validates :displayname, presence: true
  validates :displayname, uniqueness: true
  validates :displayname, length: { minimum: 5 }
  validates :guild_anagram, length: { maximum: 5 }

  acts_as_google_authenticated :drift => 65, :issuer => 'Transcendence' # google-authenticator-rails

  has_many :chat_messages
  has_many :user_blocks
  has_and_belongs_to_many :chat_rooms
  has_many :tournament_game_users
  has_many :tournament_games, through: :tournament_game_users
  has_many :chat_rooms_ownership, class_name: 'ChatRoom', inverse_of: :owner
  belongs_to :guild, optional: true

  enum status: [ :online, :offline, :in_game ]

  def as_json(options={})
    super(
      :include => {
        :guild => {},
      },
      :only => [
        :id,
        :avatar_url,
        :displayname,
        :default_settings,
        :intra_id,
        :email,
        :login,
        :first_name,
        :last_name,
        :intra_url,
        :intra_displayname,
        :intra_image_url,
        :is_intra_staff,
        :points,
        :win,
        :loss,
        :rank,
        :admin,
        :status,
        :guild,
        :current_game_id,
        :friends_id,
        :guild_id,
        :guild_anagram,
        :banned,
        :match_history,
        :won_tournaments,
      ]
    )
  end
end
