# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_10_09_143949) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "chat_messages", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "chat_room_id"
    t.string "content"
    t.string "avatar_url"
    t.string "author_name"
    t.datetime "date"
    t.string "guild_anagram"
    t.index ["chat_room_id"], name: "index_chat_messages_on_chat_room_id"
    t.index ["user_id"], name: "index_chat_messages_on_user_id"
  end

  create_table "chat_room_admins", force: :cascade do |t|
    t.bigint "chat_room_id"
    t.bigint "user_id"
    t.index ["chat_room_id"], name: "index_chat_room_admins_on_chat_room_id"
    t.index ["user_id"], name: "index_chat_room_admins_on_user_id"
  end

  create_table "chat_room_mutes", force: :cascade do |t|
    t.bigint "chat_room_id"
    t.bigint "user_id"
    t.boolean "ban"
    t.datetime "end"
    t.index ["chat_room_id"], name: "index_chat_room_mutes_on_chat_room_id"
    t.index ["user_id"], name: "index_chat_room_mutes_on_user_id"
  end

  create_table "chat_rooms", force: :cascade do |t|
    t.string "name"
    t.bigint "owner_id"
    t.string "password_digest"
    t.bigint "dm_player1_id"
    t.bigint "dm_player2_id"
    t.boolean "is_dm_channel", default: false
    t.boolean "private", default: false
    t.boolean "is_game_channel", default: false
    t.bigint "game_id"
    t.index ["owner_id"], name: "index_chat_rooms_on_owner_id"
  end

  create_table "chat_rooms_users", id: false, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "chat_room_id", null: false
  end

  create_table "defy_requests", force: :cascade do |t|
    t.bigint "defier_id"
    t.bigint "user_id"
    t.integer "bonus"
    t.string "map"
    t.index ["defier_id"], name: "index_defy_requests_on_defier_id"
    t.index ["user_id"], name: "index_defy_requests_on_user_id"
  end

  create_table "games", force: :cascade do |t|
    t.integer "player1_id"
    t.integer "player2_id"
    t.integer "player1_score"
    t.integer "player2_score"
    t.integer "game_mode"
    t.integer "max_score"
    t.integer "status"
    t.integer "bonus"
    t.bigint "tournament_game_id"
    t.datetime "finish_date"
    t.index ["tournament_game_id"], name: "index_games_on_tournament_game_id"
  end

  create_table "guilds", force: :cascade do |t|
    t.string "name"
    t.string "anagram"
    t.integer "points"
    t.integer "rank"
    t.bigint "owner_id", default: 0
    t.bigint "officers_id", default: [], array: true
    t.bigint "members_id", default: [], array: true
    t.bigint "wars_id", default: [], array: true
    t.bigint "actual_war_id"
    t.bigint "history_wars_id_id", default: [], array: true
    t.integer "history_wars_id", default: [], array: true
    t.index ["actual_war_id"], name: "index_guilds_on_actual_war_id"
    t.index ["history_wars_id_id"], name: "index_guilds_on_history_wars_id_id"
    t.index ["members_id"], name: "index_guilds_on_members_id"
    t.index ["officers_id"], name: "index_guilds_on_officers_id"
    t.index ["owner_id"], name: "index_guilds_on_owner_id"
    t.index ["wars_id"], name: "index_guilds_on_wars_id"
  end

  create_table "tournament_game_users", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "tournament_game_id"
    t.boolean "eliminated"
    t.integer "eliminated_at_round"
    t.integer "pos_x", default: 0
    t.integer "pos_y", default: 0
    t.index ["tournament_game_id"], name: "index_tournament_game_users_on_tournament_game_id"
    t.index ["user_id"], name: "index_tournament_game_users_on_user_id"
  end

  create_table "tournament_games", force: :cascade do |t|
    t.bigint "tournament_id"
    t.integer "status"
    t.integer "round"
    t.integer "turn"
    t.integer "user_count"
    t.index ["tournament_id"], name: "index_tournament_games_on_tournament_id"
  end

  create_table "tournaments", force: :cascade do |t|
    t.string "name"
    t.datetime "begin_date"
    t.datetime "end_date"
    t.integer "max_score"
    t.integer "bonus"
    t.integer "id_array", default: 0
  end

  create_table "user_blocks", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "blocked_id"
    t.index ["blocked_id"], name: "index_user_blocks_on_blocked_id"
    t.index ["user_id"], name: "index_user_blocks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "avatar_url"
    t.string "displayname"
    t.boolean "default_settings"
    t.string "access_token"
    t.string "token_type"
    t.datetime "token_expire"
    t.string "refresh_token"
    t.string "token_scope"
    t.integer "intra_id"
    t.string "email"
    t.string "login"
    t.string "first_name"
    t.string "last_name"
    t.string "intra_url"
    t.string "intra_displayname"
    t.string "intra_image_url"
    t.boolean "is_intra_staff"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "points", default: 0
    t.integer "win", default: 0
    t.integer "loss", default: 0
    t.integer "rank", default: 0
    t.boolean "admin", default: false
    t.integer "status", default: 0
    t.bigint "friends_id", default: [], array: true
    t.bigint "guild_id"
    t.string "guild_anagram", default: ""
    t.json "match_history", array: true
    t.string "google_secret"
    t.boolean "mfa_enabled"
    t.boolean "fake", default: false
    t.integer "won_tournaments", default: 0
    t.bigint "current_game_id"
    t.boolean "banned", default: false
    t.index ["friends_id"], name: "index_users_on_friends_id"
    t.index ["guild_id"], name: "index_users_on_guild_id"
    t.index ["login"], name: "index_users_on_login", unique: true
  end

  create_table "waiting_matches", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "level"
    t.boolean "ranked"
    t.index ["user_id"], name: "index_waiting_matches_on_user_id"
  end

  create_table "war_defy_requests", force: :cascade do |t|
    t.bigint "wars_waiting_match_id"
    t.bigint "defier_id"
    t.bigint "user_id"
    t.index ["defier_id"], name: "index_war_defy_requests_on_defier_id"
    t.index ["user_id"], name: "index_war_defy_requests_on_user_id"
    t.index ["wars_waiting_match_id"], name: "index_war_defy_requests_on_wars_waiting_match_id"
  end

  create_table "wars", force: :cascade do |t|
    t.string "guild1"
    t.string "guild2"
    t.datetime "start"
    t.datetime "end"
    t.integer "prize", default: 0
    t.integer "winner"
    t.bigint "guild1_id"
    t.bigint "guild2_id"
    t.integer "guild1_points", default: 0
    t.integer "guild2_points", default: 0
    t.integer "bonus"
    t.integer "matchs_max_without_response"
    t.integer "maxScore"
    t.boolean "pending", default: true
    t.boolean "all_matchs_count"
    t.integer "matchs_without_response", default: 0
    t.datetime "warTimeBegin"
    t.datetime "warTimeEnd"
    t.index ["guild1_id"], name: "index_wars_on_guild1_id"
    t.index ["guild2_id"], name: "index_wars_on_guild2_id"
  end

  create_table "wars_waiting_matches", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "defied_guild_id"
    t.bigint "guild_id"
    t.index ["defied_guild_id"], name: "index_wars_waiting_matches_on_defied_guild_id"
    t.index ["guild_id"], name: "index_wars_waiting_matches_on_guild_id"
    t.index ["user_id"], name: "index_wars_waiting_matches_on_user_id"
  end

end
