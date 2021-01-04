class WarsController < ApplicationController
  before_action :require_admin, except: [:index, :show]
  before_action :set_todo, only: [:show, :update, :destroy]

  # GET /wars
  def index
    @wars = War.all
    json_response(@wars)
  end

  # POST /wars
  def create
    @todo = War.create!(todo_params)

    WarsStartJob.set(wait_until: @todo.start).perform_later @todo.id
    WarsEndJob.set(wait_until: @todo.end).perform_later @todo.id

    json_response(@todo, :created)
  end

  # GET /wars/:id
  def show
    json_response(@todo)
  end

  # PUT /wars/:id
  def update
    @todo.update(todo_params)
    head :no_content
  end

  # DELETE /wars/:id
  def destroy
    @todo.destroy
    head :no_content
  end

  private

  def todo_params
    # whitelist params
    params.permit(:title, :created_by, :guild1, :guild2, :start, :end,
	:prize, :winner, :guild1_id, :guild2_id, :guild1_points, :guild2_points, :bonus, :matchs_max_without_response, :maxScore, :pending, :all_matchs_count, :matchs_without_response, :warTimeBegin, :warTimeEnd)
  end

  def set_todo
    @todo = War.find(params[:id])
  end
end
