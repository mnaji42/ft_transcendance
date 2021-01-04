class WarTimeTable < ActiveRecord::Migration[6.0]
  def change
    remove_column :wars, :warTimeBegin
    remove_column :wars, :warTimeEnd
    add_column :wars, :warTimeBegin, :datetime
    add_column :wars, :warTimeEnd, :datetime
  end
end
