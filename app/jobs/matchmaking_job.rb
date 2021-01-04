class MatchmakingJob < ApplicationJob
  queue_as :default
  sidekiq_options retry: 0

  def perform(matchmaking_id, round)
    ActiveRecord::Base.transaction do
      wm = WaitingMatch.find_by(id: matchmaking_id)
      return unless wm

      delta = 0
      delta = 2 if round == 0
      delta = 4 if round == 1
      delta = 7 if round == 2
      delta = 10 if round == 3
      delta = 100000 if round == 4

      matches = nil
      if wm.ranked
        matches = WaitingMatch.where(
          # 'ranked = ? and id != ?',
          'level >= ? and level <= ? and ranked = ? and id != ?',
          wm.level - delta,
          wm.level + delta,
          wm.ranked,
          wm.id
        ).all
      else
        p 'not ranked'
        matches = WaitingMatch.where(
          'ranked = ? and id != ?',
          wm.ranked,
          wm.id
        ).all
      end

      sorted = matches.sort do |a, b|
        (wm.level - a.level).abs - (wm.level - b.level).abs
      end

      found = sorted[0] # this match has the closest level to user's level

      if found then

        game = Game.create(
          :player1_id => found.user_id,
          :player2_id => wm.user_id,
          :game_mode => wm.ranked ? :ranked : :training,
          :max_score => 5,
          :status => :started,
          :bonus => :BonusDefault,
        )
        game.save!
        found.delete
        wm.delete

        ActionCable.server.broadcast("matchmaking_#{wm.id}", { :found => true, :game => game })
        ActionCable.server.broadcast("matchmaking_#{found.id}", { :found => true, :game => game })
        GameHeartbeatJob.set(wait: 1.second).perform_later game.id
      else
        if round == 4 then
          ActionCable.server.broadcast("matchmaking_#{wm.id}", { :found => false })
          wm.delete
        else
          MatchmakingJob.set(wait: 3.second).perform_later wm.id, round + 1
        end
      end
    end
  end

end
