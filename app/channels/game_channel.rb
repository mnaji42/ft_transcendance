class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game_#{params[:game_id]}"
    @redis = Redis.new(host: 'redis')
    @game = Game.find(params[:game_id])
    @spectate = @game.player1_id != current_user.id && @game.player2_id != current_user.id
  end

  def receive(data)
    return if @spectate

    if data['event'] == 'giveup'
      @redis.publish("game_inputs_#{params[:game_id]}", JSON.generate({
        :player_id => current_user.id, 
        :event => 'giveup', 
      }))

    else
      @redis.publish("game_inputs_#{params[:game_id]}", JSON.generate({
        :player_id => current_user.id, 
        :y => data['y'],
      }))

    end
  end

  def unsubscribed
    return if @spectate

    @redis.publish("game_inputs_#{params[:game_id]}", JSON.generate({
      :player_id => current_user.id, 
      :event => 'giveup', 
    }))
  end
end
