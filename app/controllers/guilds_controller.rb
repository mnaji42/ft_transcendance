class GuildsController < ApplicationController
  before_action :require_admin, except: [:index, :show, :create, :destroy]
  before_action :set_todo, only: [:show, :update, :destroy]

  # GET /guilds
  def index
    @guilds = Guild.order(rank: :asc).all
	# update_rank()
    json_response(@guilds)
  end

  # POST /guilds
  def create
    if !current_user.guild_id.nil?
      json_response({ :error => 'You are already in a guild' }, :forbidden)
      return
    end

    ActiveRecord::Base.transaction do
      @guild = Guild.create(
        name: params[:name],
        anagram: params[:anagram],
        points: 0,
        owner_id: current_user.id,
        officers_id: [],
        members_id: [current_user.id],
        wars_id: [],
        history_wars_id: [],
      )
      @guild.save!

      current_user.guild_id = @guild.id
      current_user.guild_anagram = @guild.anagram
      current_user.save!

      RankHelper.recalculate_guilds
    end

    json_response(@guild, :created)
  end

  # GET /guilds/:id
  def show
	update_rank()
    json_response(@guild)
  end

  # PUT /guilds/:id
  def update
    @guild.update(todo_params)
    head :no_content
  end

  # DELETE /guilds/:id
  def destroy
    if !current_user.admin && @guild.owner_id != current_user.id
      json_response({ :error => 'You must be guild owner' }, :forbidden)
      return
    end

    GuildHelper.delete(@guild)

    head :no_content
  end

  private

  def todo_params
    # whitelist params
    params.permit(:title, :created_by, :name, :anagram, :points, :rank,
  :owner_id, :actual_war_id, {officers_id: []}, {members_id: []}, {wars_id: []}, {history_wars_id: []})
  end

  def set_todo
    @guild = Guild.find(params[:id])
  end

  def update_rank
  #   @guilds = Guild.all
	# @guilds = @guilds.sort_by {|obj| -obj.points}
	# $i = 0
	# while $i < @guilds.length do
	# 	@guilds[$i].rank = $i + 1
	# 	@guilds[$i].save
	# 	$i += 1
	# end
  end
end
