class TournamentGameUser < ApplicationRecord
  belongs_to :user
  belongs_to :tournament_game
end
