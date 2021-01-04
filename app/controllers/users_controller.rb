class UsersController < ApplicationController
  before_action :require_admin, except: [:index, :show, :update]
  before_action :set_todo, only: [:show, :update, :destroy]

  # GET /users
  def index
    @users = User.where(banned: false).order(rank: :asc).all
	update_rank()
    json_response(@users)
  end

  # POST /users
  def create
    @todo = User.create!(admin_params)
    json_response(@todo, :created)
  end

  # GET /users/:id
  def show
	update_rank()
    json_response(@todo)
  end

  # PUT /users/:id
  def update

    if !current_user.admin && params[:id].to_i == current_user.id then
      @todo.update!(self_params)
    elsif current_user.admin
      @todo.update!(admin_params)
    else
      json_response({ :error => 'You are not allowed to do that!' }, :unauthorized)
      return
    end

    head :no_content
  end

  # DELETE /users/:id
  def destroy
    @todo.destroy
    head :no_content
  end

  private

  def self_params
    params.permit(:avatar_url, :displayname, :default_settings)
  end

  def admin_params
    # whitelist params
    params.permit(:avatar_url, :displayname, :default_settings, :admin)
  end

  def set_todo
	@todo = User.find(params[:id])
  end

  def update_rank
    # now in RankHelper
  #   @users = User.all
	# @users = @users.sort_by {|obj| -obj.points}
	# $i = 0
	# while $i < @users.length do
	# 	@users[$i].rank = $i + 1
	# 	@users[$i].save
	# 	$i += 1
	# end
  end
end
