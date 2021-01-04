class Game < ApplicationRecord
  enum status: [ :started, :finished ]
  enum game_mode: [ :tournament, :ranked, :training, :war, :duel ]
  enum bonus: [ :BonusDefault, :BonusBarrier, :BonusDoubleBall ]
  belongs_to :tournament_game, optional: true
  has_one :chat_room

  def as_json(options={})
    super(:include => :chat_room)
  end
end
