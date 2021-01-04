class AddIdArrayToTournament < ActiveRecord::Migration[6.0]
  def change
    add_column :tournaments, :id_array, :integer, default: 0
  end
end
