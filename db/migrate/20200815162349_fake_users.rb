class FakeUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :fake, :boolean, default: false
  end
end
