class TournamentGame < ApplicationRecord
  belongs_to :tournament
  has_many :tournament_game_users
  has_many :users, through: :tournament_game_users
  has_many :games
  enum status: [ :waiting, :started ]
end
