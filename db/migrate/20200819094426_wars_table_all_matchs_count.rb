class WarsTableAllMatchsCount < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :all_matchs_count, :boolean
  end
end
