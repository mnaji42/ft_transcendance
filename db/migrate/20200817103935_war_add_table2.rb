class WarAddTable2 < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :matchs_max_without_response, :integer
    add_column :wars, :maxScore, :integer
    add_column :wars, :pending, :boolean, default: true
  end
end
