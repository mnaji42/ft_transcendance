class WarsTableAjout < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :guild1_points, :integer, default: 0
    add_column :wars, :guild2_points, :integer, default: 0
    add_column :wars, :bonus, :integer
    rename_column :wars, :points, :prize
  end
end
