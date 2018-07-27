class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :title
      t.integer :host_id
      t.integer :group_id
      t.string :location
      t.string :description
      t.timestamps
    end
  end
end
