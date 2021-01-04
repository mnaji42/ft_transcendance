class CreateWar < ActiveRecord::Migration[5.2]
  def change
    create_table :wars do |t|
      t.string :guild1
      t.string :guild2
      t.datetime :start
      t.datetime :end
      t.integer :points, default: 0
      t.integer :winner
    end
  end
end
