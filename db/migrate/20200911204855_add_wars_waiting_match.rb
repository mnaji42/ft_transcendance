class AddWarsWaitingMatch < ActiveRecord::Migration[6.0]
  def change
    create_table :wars_waiting_matches do |t|
      t.belongs_to :user
      t.belongs_to :defied_guild
      t.belongs_to :guild
    end
    create_table :war_defy_requests do |t|
      t.belongs_to :wars_waiting_match
      t.belongs_to :defier
      t.belongs_to :user
    end
  end
end
