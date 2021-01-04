class AddGoogleAuthenticator < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :google_secret, :string
    add_column :users, :mfa_enabled, :bool
  end
end
