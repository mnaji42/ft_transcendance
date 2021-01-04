class GuildHistoryWarsId < ActiveRecord::Migration[6.0]
  def change
    add_reference :guilds, :history_wars_id, index: true, array: true, default: []
  end
end
