class MatchHistoryController < ApplicationController

  # GET /match_history/:id
  def get
    user = User.find(params[:id])
    games = Game.where('player1_id = ? or player2_id = ?', user.id, user.id)
      .where(status: :finished)
      .order(finish_date: :desc).all
    json_response games
  end

end
