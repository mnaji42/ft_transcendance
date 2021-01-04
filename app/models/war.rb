class War < ApplicationRecord
	enum bonus: [ :BonusDefault, :BonusBarrier, :BonusDoubleBall ]
  def as_json(options={})
    super(:only => [
      :id,
	  :guild1,
	  :guild2,
	  :start,
	  :end,
	  :prize,
	  :winner,
	  :guild1_id,
		:guild2_id,
		:guild1_points,
		:guild2_points,
		:bonus,
		:matchs_max_without_response,
		:maxScore,
		:pending,
		:all_matchs_count,
		:matchs_without_response,
		:warTimeBegin,
		:warTimeEnd
    ])
  end
end
