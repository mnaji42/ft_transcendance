class GamesController < ApplicationController

  # GET /games/:id
  def show
    json_response(Game.find(params[:id]))
  end

end