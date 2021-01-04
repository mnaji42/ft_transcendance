class AddActualWar < ActiveRecord::Migration[5.2]
  def change
    add_reference :guilds, :actual_war, index: true
  end
end
