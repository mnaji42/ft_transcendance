class AddMatchHistory < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :match_history, :json, array: true
  end
end
