class FrontendController < ApplicationController
  skip_before_action :require_user
  skip_before_action :require_not_banned

  def index
  end
end
