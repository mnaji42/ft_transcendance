class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "notifications_#{current_user.id}"
    current_user.status = :online
    current_user.current_game_id = nil
    current_user.save!
  end

  def unsubscribed
    current_user.status = :offline
    current_user.current_game_id = nil
    current_user.save!
  end
end
