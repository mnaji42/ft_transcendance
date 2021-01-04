module RankHelper
  def RankHelper.recalculate
    ActiveRecord::Base.transaction do
      users = User.where(banned: false).order(points: :desc).all

      users.each_with_index do |user, index|
        user.rank = index + 1
        user.save!
      end
    end
  end
  def RankHelper.recalculate_guilds
    ActiveRecord::Base.transaction do
      users = Guild.order(points: :desc).all

      users.each_with_index do |user, index|
        user.rank = index + 1
        user.save!
      end
    end
  end
end
