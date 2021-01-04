class UserBlocksController < ApplicationController

  # GET /block/is/:id
  def is
    json_response UserBlock.where(user_id: current_user.id, blocked_id: params[:id]).any?
  end

  # POST /block/add
  def add
    ActionCable.server.broadcast "notifications_#{current_user.id}", {
      :notification => "block_refresh",
    }

    UserBlock.create(user_id: current_user.id, blocked_id: params[:user_id]).save!
  end

  # POST /block/remove
  def remove
    ActionCable.server.broadcast "notifications_#{current_user.id}", {
      :notification => "block_refresh",
    }

    UserBlock.delete(UserBlock.where(user_id: current_user.id, blocked_id: params[:user_id]))
  end

end
