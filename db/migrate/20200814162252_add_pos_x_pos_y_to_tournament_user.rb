class AddPosXPosYToTournamentUser < ActiveRecord::Migration[6.0]
  def change
    add_column :tournament_game_users, :pos_x, :integer, default: 0
    add_column :tournament_game_users, :pos_y, :integer, default: 0
  end
end
