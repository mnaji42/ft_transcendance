class AddGuildsIndex < ActiveRecord::Migration[5.2]
  def change
    add_reference :wars, :guild1, index: true
    add_reference :wars, :guild2, index: true
  end
end
