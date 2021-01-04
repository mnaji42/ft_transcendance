class MatchmakingChannel < ApplicationCable::Channel
  # Someone started listening to the channel
  def subscribed
    p params[:ranked]
    @wm = WaitingMatch.create(user_id: current_user.id, level: current_user.points, ranked: params[:ranked])
    @wm.save!
    stream_from "matchmaking_#{@wm.id}"

    MatchmakingJob.set(wait: 1.second).perform_later @wm.id, 0
  end

  def unsubscribed
    @wm.delete
  end
end
