class AddFinishDateToGame < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :finish_date, :datetime
  end
end
