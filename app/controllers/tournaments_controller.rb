class TournamentsController < ApplicationController
  before_action :require_admin, except: [:index, :show]
  before_action :set_tournament, only: [:show, :update, :destroy]

  # GET /tournaments
  def index
    @tournaments = Tournament.all
    json_response(@tournaments)
  end

  # POST /tournaments
  def create
    @tournament = Tournament.create!(tournament_params)
    json_response(@tournament, :created)
  end

  # GET /tournaments/:id
  def show
    json_response(@tournament)
  end

  # PUT /tournaments/:id
  def update
    @tournament.update(tournament_params)
    head :no_content
  end

  # DELETE /tournaments/:id
  def destroy
    @tournament.destroy
    head :no_content
  end

  private

  def tournament_params
    # whitelist params
    params.permit(:id_array, :name, :begin_date, :end_date, :max_score, :bonus)
  end

  def set_tournament
    @tournament = Tournament.find(params[:id])
  end

end