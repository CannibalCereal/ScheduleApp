# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_08_10_001030) do

  create_table "availabilities", force: :cascade do |t|
    t.integer "user_id"
    t.integer "event_id"
    t.string "start"
    t.string "end"
    t.index ["event_id"], name: "index_availabilities_on_event_id"
    t.index ["user_id"], name: "index_availabilities_on_user_id"
  end

  create_table "events", force: :cascade do |t|
    t.string "title"
    t.integer "host_id"
    t.integer "group_id"
    t.string "location"
    t.string "description"
    t.boolean "isFinal"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "final_events", force: :cascade do |t|
    t.integer "event_id"
    t.string "start"
  end

  create_table "groups", force: :cascade do |t|
    t.string "name"
    t.integer "admin_id"
  end

  create_table "invites", force: :cascade do |t|
    t.string "email"
    t.integer "group_id"
    t.integer "sender_id"
    t.integer "recipient_id"
    t.string "token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "memberships", force: :cascade do |t|
    t.integer "user_id"
    t.integer "group_id"
    t.index ["group_id"], name: "index_memberships_on_group_id"
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "name"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
