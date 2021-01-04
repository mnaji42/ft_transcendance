class AddTournamentIdToGame < ActiveRecord::Migration[6.0]
  def change
    add_reference :games, :tournament_game, index: true, null: true
  end
end
