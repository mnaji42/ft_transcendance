class WarsWaitingMatch < ApplicationRecord
  belongs_to :user
  belongs_to :defied_guild, class_name: 'Guild'
  belongs_to :guild
end
