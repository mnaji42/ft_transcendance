class WarTimeDate < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :warTimeBegin, :date
    add_column :wars, :warTimeEnd, :date
  end
end
