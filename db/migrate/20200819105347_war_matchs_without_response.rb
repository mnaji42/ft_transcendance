class WarMatchsWithoutResponse < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :matchs_without_response, :integer, default: 0
  end
end
