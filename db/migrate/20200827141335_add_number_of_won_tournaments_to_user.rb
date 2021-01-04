class AddNumberOfWonTournamentsToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :won_tournaments, :integer, default: 0
  end
end
