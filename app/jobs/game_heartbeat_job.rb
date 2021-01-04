class GameHeartbeatJob < ApplicationJob
  queue_as :default
  sidekiq_options retry: 0

  def collision(ball, player, x)
    # p 'COLLISION?', ball, player, x if player[:barrier]
    # p 'COLLISION?--', ball[:x] + ball[:radius] >= player[:x], ball[:y] + ball[:radius] >= player[:y] if player[:barrier]
    # p 'COLLISION?--', ball[:x] - ball[:radius] < player[:x] + player[:width], ball[:y] - ball[:radius] < player[:y] + player[:height] if player[:barrier]
    if
      ball[:x] + ball[:radius] >= player[:x] &&
      ball[:y] + ball[:radius] >= player[:y] &&
      ball[:x] - ball[:radius] < player[:x] + player[:width] &&
      ball[:y] - ball[:radius] < player[:y] + player[:height] &&
      (!ball[:pause] || Time.now > ball[:pause])
    then
      
      if x != -1 then
        ball[:x] = 2 * x - ball[:x]
      end
      ball[:speed_x] *= -1

      if ball[:y] < player[:y] + player[:height] / 2 then
        ball[:speed_y] = ball[:speed_y] > 0 ? ball[:speed_y] + 0.2 : ball[:speed_y] - 0.2
      else
        ball[:speed_x] = ball[:speed_x] > 0 ? ball[:speed_x] + 0.2 : ball[:speed_x] - 0.2
      end
      
      ball[:pause] = Time.now + 0.1.seconds
    end
  end

  def score_update(tournament_game, player_tu, score)
    if tournament_game then
      message = {
        :notification => 'update_score',
        :tournament_game => tournament_game,
        :tournament_game_users => tournament_game.tournament_game_users.order(:pos_y),
        :player => player_tu,
        :score => score,
      }
      ActionCable.server.broadcast "tournament_#{tournament_game.id}", message
    end
  end

  def perform(game_id)
    game = Game.find(game_id)

    chat_room = ChatRoom.create(
      name: "Game #{game_id}",
      is_game_channel: true,
      game_id: game_id
    )
    chat_room.user_ids.push(game.player1_id)
    chat_room.user_ids.push(game.player2_id)
    chat_room.save!

    ActionCable.server.broadcast "notifications_#{game.player1_id}", {
      :notification => "game_channel_open",
      :room => chat_room,
    }
    ActionCable.server.broadcast "notifications_#{game.player2_id}", {
      :notification => "game_channel_open",
      :room => chat_room,
    }

    width = 300
    height = 150

    tps = 50.0 # ticks per second
    speed_factor = 100.0 / tps
    # speed_factor = 10.0 / tps

    state = {
      :width => width,
      :height => height,
      :player1 => {
        :x => 5,
        :y => height / 2 - 30 / 2,
        :width => 5,
        :height => 30,
        :score => 0,
      },
      :player2 => {
        :x => width - 10,
        :y => height / 2 - 30 / 2,
        :width => 5,
        :height => 30,
        :score => 0,
      },
      :ball1 => {
        :x => width / 2,
        :y => height / 2,
        :radius => 3,
        :speed => 1.5,
        :speed_x => 1.5,
        :speed_y => 1.5,
        :pause => nil,
      },
      :barrier => game.bonus == 'BonusBarrier' ? {
        :x => width / 2 - 2.5,
        :y => height / 2 - 40 / 2,
        :width => 5,
        :height => 40,
        :speed => 1.5
      } : nil,
      :ball2 => game.bonus == 'BonusDoubleBall' ? {
        :x => width / 2,
        :y => height / 2,
        :radius => 3,
        :speed => -1.5,
        :speed_x => -1.5,
        :speed_y => -1.5,
        :pause => nil
      } : nil,
      :ball_out1 => 0,
      :ball_out2 => 0,
      :pause => Time.now + 3.seconds,
    }

    player1 = User.find(game.player1_id)
    player1.status = :in_game
    player1.current_game_id = game.id
    player1.save!
    player2 = User.find(game.player2_id)
    player2.status = :in_game
    player2.current_game_id = game.id
    player2.save!

    player1_tu = nil
    player2_tu = nil
    tournament_game = nil
    if game.game_mode == "tournament" then
      tournament_game = game.tournament_game
      player1_tu = tournament_game.tournament_game_users.find_by(user_id: game.player1_id)
      player2_tu = tournament_game.tournament_game_users.find_by(user_id: game.player2_id)

      # if eliminated (gave up), just don't play
      if player1_tu.eliminated then
        player2[:score] = game.max_score
      elsif player2_tu.eliminated then
        player1[:score] = game.max_score
      end
    end

    puts "Starting game id #{game_id}!"

    player1 = state[:player1]
    player2 = state[:player2]
    ball1 = state[:ball1]
    ball2 = state[:ball2]
    barrier = state[:barrier]

    sub_thread = Thread.new do
      redis = Redis.new(host: 'redis')
      redis.subscribe("game_inputs_#{game_id}") do |on|
        on.message do |channel, message|
          msg = JSON.parse(message)
          player_id = msg['player_id']

          if msg['event'] == 'giveup' then

            if game.player1_id == player_id
              player2[:score] = game.max_score
              score_update(tournament_game, player2_tu, player2[:score])
            else
              player1[:score] = game.max_score
              score_update(tournament_game, player1_tu, player1[:score])
            end

          else
            y = msg['y']

            if game.player1_id == player_id
              player1[:y] = y
            else
              player2[:y] = y
            end
          end
        end
      end
    end

    loop do

      if !state[:pause] || Time.now > state[:pause] then

        if state[:ball_out1] == 0 then
          ball1[:x] += ball1[:speed_x] * speed_factor
          ball1[:y] += ball1[:speed_y] * speed_factor
        end

        if ball2 && state[:ball_out2] == 0 then
          ball2[:x] += ball2[:speed_x] * speed_factor
          ball2[:y] += ball2[:speed_y] * speed_factor
        end

        # Collision with walls

        if ball1[:y] + ball1[:radius] >= state[:height] then
          ball1[:y] = 2 * state[:height] - ball1[:y]
          ball1[:speed_y] = -ball1[:speed_y]
        elsif ball1[:y] - ball1[:radius] < 0 then
          ball1[:y] = -ball1[:y]
          ball1[:speed_y] = -ball1[:speed_y]
        end

        if ball2 then
          if ball2[:y] + ball2[:radius] >= state[:height] then
            ball2[:y] = 2 * state[:height] - ball2[:y]
            ball2[:speed_y] = -ball2[:speed_y]
          elsif ball2[:y] - ball2[:radius] < 0 then
            ball2[:y] = -ball2[:y]
            ball2[:speed_y] = -ball2[:speed_y]
          end
        end

        # Move barrier

        if barrier then
          barrier[:y] += barrier[:speed] * speed_factor
          if barrier[:y] < 0 ||
              barrier[:y] + barrier[:height] >= height then

            barrier[:speed] *= -1
          end
        end

        # Player and barrier collision

        collision(ball1, player1, player1[:x] + player1[:width])
        collision(ball1, player2, player2[:x])
        if barrier && state[:ball_out1] == 0 then
          collision(ball1, barrier, -1)
        end
        if ball2 then
          collision(ball2, player1, player1[:x] + player1[:width])
          collision(ball2, player2, player2[:x])
          if barrier && state[:ball_out2] == 0 then
            collision(ball2, barrier, -1)
          end
        end

        # Score condition

        if ball1[:x] - ball1[:radius] < 0 then
          ball1[:x] = state[:width] / 2
          ball1[:y] = state[:height] / 2
          ball1[:speed_x] = -ball1[:speed]
          ball1[:speed_y] = ball1[:speed]
          state[:ball1_out1] = 1
          player2[:score] += 1
          score_update(tournament_game, player2_tu, player2[:score])
        elsif ball1[:x] + ball1[:radius] >= state[:width] then
          ball1[:x] = state[:width] / 2
          ball1[:y] = state[:height] / 2
          ball1[:speed_x] = ball1[:speed]
          ball1[:speed_y] = ball1[:speed]
          state[:ball_out1] = 2
          player1[:score] += 1
          score_update(tournament_game, player1_tu, player1[:score])
        end

        if ball2 then
          if ball2[:x] - ball2[:radius] < 0 then
            ball2[:x] = state[:width] / 2
            ball2[:y] = state[:height] / 2
            ball2[:speed_x] = -ball2[:speed]
            ball2[:speed_y] = ball2[:speed]
            state[:ball_out2] = 1
            player2[:score] += 1
            score_update(tournament_game, player2_tu, player2[:score])
          elsif ball2[:x] + ball2[:radius] >= state[:width] then
            ball2[:x] = state[:width] / 2
            ball2[:y] = state[:height] / 2
            ball2[:speed_x] = ball2[:speed]
            ball2[:speed_y] = ball2[:speed]
            state[:ball_out2] = 2
            player1[:score] += 1
            score_update(tournament_game, player1_tu, player1[:score])
          end
        end

        # No ball left

        if (state[:ball_out1] > 0 && !ball2) ||
            (state[:ball_out2] > 0 && state[:ball_out1] > 0) then

          state[:ball_out1] = 0
          state[:ball_out2] = 0 if ball2
          barrier[:y] = state[:height] / 2 - barrier[:height] / 2 if barrier

          # PAUSE
          state[:pause] = Time.now + 1.second

        end

      end

      # Send state

      ActionCable.server.broadcast "game_#{game_id}", { :message => :update, :state => state }

      # Win condition

      if player1[:score] >= game.max_score || player2[:score] >= game.max_score then
        break
      end

      sleep(1.0 / tps)
    end

    Thread.kill(sub_thread)

    game.status = :finished
    game.player1_score = player1[:score]
    game.player2_score = player2[:score]
    game.finish_date = Time.now
    game.save!

    puts "Game id #{game_id} ended!"

    winner_id = nil
    loser_id = nil
    if player1[:score] >= game.max_score then
      winner_id = game.player1_id
      loser_id = game.player2_id
    else
      loser_id = game.player1_id
      winner_id = game.player2_id
    end


    ActiveRecord::Base.transaction do
      winner = User.find(winner_id)
      loser = User.find(loser_id)

      if winner.current_game_id == game.id
        winner.status = :online
        winner.current_game_id = nil
      end

      if loser.current_game_id == game.id
        loser.status = :online
        loser.current_game_id = nil
      end

      if game.game_mode == "tournament" || game.game_mode == "ranked" || game.game_mode == "war"
        winnerguild = winner.guild

        if winnerguild
          points = (20 / (1 + Math.exp(-0.05 * (loser.points - winner.points)))).ceil
          winnerguild.points += points
          winnerguild.save!
        end
      end

      if game.game_mode == "tournament" then

        TournamentGame.increment_counter :turn, game.tournament_game_id

        tournament_game = tournament_game.reload

        winner = User.find(winner_id)
        winner.save!
        loser.save!

        winner_tu = tournament_game.tournament_game_users.find_by(user_id: winner_id)
        loser_tu = tournament_game.tournament_game_users.find_by(user_id: loser_id)
        winner_old = winner_tu.dup
        loser_old = loser_tu.dup

        winner_tu.pos_x += 1
        winner_tu.pos_y = (winner_tu.pos_y - 1) / 2 + 1
        winner_tu.save!

        loser_tu.eliminated = true
        loser_tu.eliminated_at_round = tournament_game.round
        loser_tu.save!

        if
          (tournament_game.round == 0 && tournament_game.turn == 4) ||
          (tournament_game.round == 1 && tournament_game.turn == 2)
        then
          tournament_game.round += 1
          tournament_game.turn = 0
          TournamentStartGames.set(wait: 5.seconds).perform_later tournament_game.id
        end

        message = {
          :notification => 'win',
          :tournament_game => tournament_game,
          :tournament_game_users => tournament_game.tournament_game_users,
          :winner => winner_old,
          :loser => loser_old,
          :game => game,
        }
        tournament_game.save!
        ActionCable.server.broadcast "tournament_#{tournament_game.id}", message

        if tournament_game.round == 2 && tournament_game.turn == 1 then
          message = {
            :notification => 'end',
            :tournament_game => tournament_game,
            :tournament_game_users => tournament_game.tournament_game_users,
            :winner => winner_old,
          }
          winner.won_tournaments += 1
          winner.save!
        end

        if !winner.guild_id.nil?

          war = War.find(winner.guild.actual_war_id)
          if war.all_matchs_count
            if war.guild1_id == winner.guild_id
              war.guild1_points += 1
            else
              war.guild2_points += 1
            end
            war.save!
          end

        end

      elsif game.game_mode == "ranked" then
        winner.win += 1
        loser.loss += 1

        points = (20 / (1 + Math.exp(-0.05 * (loser.points - winner.points)))).ceil
        winner.points += points
        loser.points -= points

        winner.save!
        loser.save!

        if !winner.guild_id.nil?
          war = War.find(winner.guild.actual_war_id)
          if war.all_matchs_count
            if war.guild1_id == winner.guild_id
              war.guild1_points += 1
            else
              war.guild2_points += 1
            end
            war.save!
          end
        end

        RankHelper.recalculate

      elsif game.game_mode == "war" then

        war = War.find(winner.guild.actual_war_id)
        if war.guild1_id == winner.guild_id
          war.guild1_points += 1
        else
          war.guild2_points += 1
        end
        war.save!

      elsif game.game_mode == "duel" then
        loserguild = loser.guild
        winnerguild = winner.guild

        if loserguild && winnerguild && !winnerguild.actual_war_id.nil? && winnerguild.actual_war_id == loserguild.actual_war_id then
          war = War.find(winnerguild.actual_war_id)

          p winnerguild.id, war.guild1_id

          if winnerguild.id == war.guild1_id then
            war.guild1_points += 1
          else
            war.guild2_points += 1
          end
          
          war.save!
        end


      end

      winner.save!
      loser.save!

    end

    ActionCable.server.broadcast "chat_#{chat_room.id}", {
      :end_of_channel => true,
    }

    chat_room.delete

    ActionCable.server.broadcast "game_#{game_id}", { :message => :end, :game => game }
  end
end