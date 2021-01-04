class TournamentChannel < ApplicationCable::Channel
  # Someone started listening to the channel
  def subscribed
    stream_from "tournament_#{params[:game_id]}"
  end

  def unsubscribed
    TournamentHelper.leave current_user
  end
end
