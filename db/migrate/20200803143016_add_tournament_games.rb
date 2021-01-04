class AddTournamentGames < ActiveRecord::Migration[6.0]
  def change
    drop_table :tournament_users do end
    drop_table :games do end
    create_table :games do |t|
      t.integer :player1_id
      t.integer :player2_id
      t.integer :player1_score
      t.integer :player2_score
      t.integer :game_mode
      t.integer :max_score
      t.integer :status
      t.integer :bonus
    end
    create_table :tournament_games do |t|
      t.belongs_to :tournament
      t.integer :status
      t.integer :round
      t.integer :turn
      t.integer :user_count
    end
    create_table :tournament_game_users do |t|
      t.belongs_to :user
      t.belongs_to :tournament_game
      t.boolean :eliminated
      t.integer :eliminated_at_round
    end
  end
end
