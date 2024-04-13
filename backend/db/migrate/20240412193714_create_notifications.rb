class CreateNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.references :group, null: false, foreign_key: true
      t.string :notification_type
      t.boolean :is_read
      t.boolean :is_archived

      t.timestamps
    end
  end
end
