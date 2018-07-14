class PagesController < ApplicationController
  before_action :require_user, only: [:home]
  def landing
  end

  def home
  end

  def eventpage
  end
end
