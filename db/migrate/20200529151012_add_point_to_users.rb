class AddPointToUsers < ActiveRecord::Migration[5.2]
  def change
    # remove_column :users, :points, :integer
    add_column :users, :point, :integer, default: 0
  end
end
