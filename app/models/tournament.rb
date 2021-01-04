class Tournament < ApplicationRecord
  validates :name, presence: true
  validates :name, uniqueness: true
  validates :name, length: { maximum: 25 }
  enum bonus: [ :BonusDefault, :BonusBarrier, :BonusDoubleBall ]
  has_many :tournament_games
end
