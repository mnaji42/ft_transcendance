class AddWarIndexes < ActiveRecord::Migration[6.0]
  def change
    add_reference :guilds, :wars, index: true, array: true, default: []
  end
end
