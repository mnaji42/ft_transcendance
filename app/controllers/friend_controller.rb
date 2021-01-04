class FriendController < ApplicationController

  # POST /friend/add
  def add
    name = params[:login] || params[:displayname]
    user = User.where('login = ? OR displayname = ?', name, name).first
    return if user.nil? || user == current_user.id || current_user.friends_id.include?(user.id)

    current_user.friends_id.push user.id
    current_user.save!
  end

  # POST /friend/remove
  def remove
    name = params[:login] || params[:displayname]
    user = User.where('login = ? OR displayname = ?', name, name).first
    return if user.nil?
    current_user.friends_id = current_user.friends_id - [user.id]
    current_user.save!
  end

end
