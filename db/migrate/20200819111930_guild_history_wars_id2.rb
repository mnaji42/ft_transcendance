class GuildHistoryWarsId2 < ActiveRecord::Migration[6.0]
  def change
    add_column :guilds, :history_wars_id, :integer, array: true, default: []
  end
end
