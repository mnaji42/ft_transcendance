class AddCurrentGameToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :current_game_id, :bigint 
  end
end
