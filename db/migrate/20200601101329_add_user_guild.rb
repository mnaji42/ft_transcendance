class AddUserGuild < ActiveRecord::Migration[5.2]
  def change
    add_reference :users, :guild, index: true
    add_column :users, :guild_anagram, :string, default: ""
  end
end
