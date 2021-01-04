class CreateGuilds < ActiveRecord::Migration[5.2]
  def change
    create_table :guilds do |t|
      t.string :name
      t.string :anagram
      t.integer :points
      t.integer :rank
    end
  end
end
