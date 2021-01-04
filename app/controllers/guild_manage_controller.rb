class GuildManageController < ApplicationController

  # POST /guild_manage/add_member
  def add_member
    ActiveRecord::Base.transaction do
      name = params[:login] || params[:displayname]
      user = User.where('login = ? OR displayname = ?', name, name).first
      guild = Guild.find(current_user.guild_id)

      if !user.guild_id.nil?
        json_response({ :error => 'User has already a guild' }, :forbidden)
        return
      end
  
      if guild.owner_id != current_user.id && !guild.officers_id.include?(current_user.id)
        json_response({ :error => 'You are not owner or officer of this guild' }, :forbidden)
        return
      end

      user.guild_id = guild.id
      user.guild_anagram = guild.anagram
      guild.members_id.push user.id

      user.save!
      guild.save!
    end
  end

  # POST /guild_manage/ban_member
  def ban_member
    ActiveRecord::Base.transaction do
      name = params[:login] || params[:displayname]
      user = User.where('login = ? OR displayname = ?', name, name).first
      guild = Guild.find_by(id: params[:guild_id])
  
      if !current_user.admin && guild.owner_id != current_user.id && !guild.officers_id.include?(current_user.id)
        json_response({ :error => 'You are not owner or officer of this guild' }, :forbidden)
        return
      end
  
      if guild.owner_id == user.id
        json_response({ :error => 'Cannot ban the guild owner' }, :forbidden)
        return
      end

      if !current_user.admin && !guild.members_id.include?(user.id)
        json_response({ :error => 'Not in the guild' }, :forbidden)
        return
      end

      user.guild_id = nil
      user.guild_anagram = nil
      guild.members_id = guild.members_id - [user.id]

      user.save!
      guild.save!
    end
  end

  # POST /guild_manage/promote_member
  def promote_member
    ActiveRecord::Base.transaction do
      name = params[:login] || params[:displayname]
      user = User.where('login = ? OR displayname = ?', name, name).first
      guild = Guild.find(current_user.guild_id)

      if guild.owner_id != current_user.id && !guild.officers_id.include?(current_user.id)
        json_response({ :error => 'You are not owner of this guild' }, :forbidden)
        return
      end

      if guild.owner_id == user.id
        json_response({ :error => 'Cannot promote the guild owner' }, :forbidden)
        return
      end

      if !guild.members_id.include?(user.id)
        json_response({ :error => 'Not in the guild' }, :forbidden)
        return
      end

      if guild.officers_id.include? user.id 
        guild.officers_id = guild.officers_id - [user.id]
      else
        guild.officers_id.push user.id
      end

      guild.save!
      user.save!
    end
  end

  # POST /guild_manage/quit
  def quit
    ActiveRecord::Base.transaction do
      guild = Guild.find(current_user.guild_id)

      if guild.owner_id == current_user.id
        GuildHelper.delete(guild)
      else
        guild.officers_id = guild.officers_id - [current_user.id]
        guild.members_id = guild.members_id - [current_user.id]
        guild.save!
      end

      current_user.guild_id = nil
      current_user.guild_anagram = nil
      current_user.save!
    end
  end

  # POST /guild_manage/new_war
  def new_war
    ActiveRecord::Base.transaction do
      guild = current_user.guild
      opponent = Guild.find_by(name: params[:guild_name])

      war = War.create(
        guild1: guild.name,
        guild2: opponent.name,
        guild1_id: guild.id,
        guild2_id: opponent.id,
        start: params[:start],
        end: params[:end],
        bonus: params[:bonus],
        matchs_max_without_response: params[:matchs_max_without_response],
        maxScore: params[:maxScore],
        prize: params[:prize],
        all_matchs_count: params[:all_matchs_count],
        warTimeBegin: params[:warTimeBegin],
        warTimeEnd: params[:warTimeEnd]
      )
      war.save!

      opponent.wars_id.push war.id
      guild.wars_id.push war.id

      opponent.save!
      guild.save!

      WarsStartJob.set(wait_until: war.start).perform_later war.id
      WarsEndJob.set(wait_until: war.end).perform_later war.id

      RankHelper.recalculate_guilds

    end
  end

  # POST /guild_manage/accept_war
  def accept_war
    ActiveRecord::Base.transaction do
      war = War.find(params[:war_id])

      guild = current_user.guild

      if guild.owner_id != current_user.id && !guild.officers_id.include?(current_user.id)
        json_response({ :error => 'You are not owner nor officer of your guild' }, :forbidden)
        return
      end

      if current_user.guild_id != war.guild2_id
        json_response({ :error => 'You cannot accept this war' }, :forbidden)
        return
      end

      if !war.pending
        json_response({ :error => 'You cannot decline a started war' }, :forbidden)
        return
      end

      # todo check dates

      # opponent = Guild.find(war.guild1_id)
      # opponent.actual_war_id = war.id
      # opponent.save!
      # guild.actual_war_id = war.id
      # guild.save!
      war.pending = false
      war.save!
    end
  end

  # POST /guild_manage/cancel_war
  def cancel_war
    ActiveRecord::Base.transaction do
      war = War.find(params[:war_id])

      guild = current_user.guild

      if guild.owner_id != current_user.id && !guild.officers_id.include?(current_user.id)
        json_response({ :error => 'You are not owner nor officer of your guild' }, :forbidden)
        return
      end

      if current_user.guild_id != war.guild1_id
        json_response({ :error => 'You cannot cancel this war' }, :forbidden)
        return
      end

      if !war.pending
        json_response({ :error => 'You cannot cencel a started war' }, :forbidden)
        return
      end

      opponent = Guild.find(war.guild2_id)
      opponent.wars_id = opponent.wars_id - [war.id]
      guild.wars_id = guild.wars_id - [war.id]

      guild.save!
      opponent.save!
      war.delete
    end
  end

  # POST /guild_manage/decline_war
  def decline_war
    ActiveRecord::Base.transaction do
      war = War.find(params[:war_id])

      guild = current_user.guild

      if guild.owner_id != current_user.id && !guild.officers_id.include?(current_user.id)
        json_response({ :error => 'You are not owner nor officer of your guild' }, :forbidden)
        return
      end

      if current_user.guild_id != war.guild2_id
        json_response({ :error => 'You cannot decline this war' }, :forbidden)
        return
      end

      if !war.pending
        json_response({ :error => 'You cannot decline a started war' }, :forbidden)
        return
      end

      opponent = Guild.find(war.guild1_id)
      opponent.wars_id = opponent.wars_id - [war.id]
      guild.wars_id = guild.wars_id - [war.id]

      guild.save!
      opponent.save!
      war.delete
    end
  end

  # POST /guild_manage/abandon_war
  def abandon_war
    ActiveRecord::Base.transaction do
      war = War.find(params[:war_id])

      guild = current_user.guild

      if guild.owner_id != current_user.id && !guild.officers_id.include?(current_user.id)
        json_response({ :error => 'You are not owner nor officer of your guild' }, :forbidden)
        return
      end

      if war.pending
        json_response({ :error => 'You cannot abandon a pending war' }, :forbidden)
        return
      end

      GuildHelper.lose_war(war, guild)
    end
  end

end
