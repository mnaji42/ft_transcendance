class AddScore < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :point, :integer
    add_column :users, :points, :integer, default: 0
    add_column :users, :win, :integer, default: 0
    add_column :users, :loss, :integer, default: 0
    add_column :users, :rank, :integer, default: 0
    add_column :users, :admin, :boolean, default: false
    add_column :users, :status, :integer, default: 0
  end
end
