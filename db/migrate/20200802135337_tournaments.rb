class Tournaments < ActiveRecord::Migration[6.0]
  def change
    create_table :tournaments do |t|
      t.string :name
      t.datetime :begin_date
      t.datetime :end_date
      t.integer :max_score
      t.integer :bonus
    end
    create_table :tournament_users do |t|
      t.belongs_to :user
      t.belongs_to :tournament
    end
  end
end
