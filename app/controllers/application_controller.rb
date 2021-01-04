class ApplicationController < ActionController::Base
  # for now
  skip_before_action :verify_authenticity_token

  before_action :require_user
  before_action :require_not_banned

  helper_method :current_user
  helper_method :json_response
  
  def current_user(check2FA = false)
    if session[:user_id] && (!check2FA || !session[:need_2fa])
      @current_user ||= User.find_by(:id => session[:user_id])
    else
      @current_user = nil
    end
  end

  def require_user
    unless session[:user_id] && !session[:need_2fa]
      json_response({ :error => 'You must be logged in!' }, :unauthorized)
    end
  end

  def require_admin
    unless current_user.admin
      json_response({ :error => 'You are not allowed to do that!' }, :forbidden)
    end
  end

  def require_not_banned
    if current_user.banned
      json_response({ :error => 'You are banned.' }, :forbidden)
    end
  end

  def json_response(object, status = :ok)
    render json: object, status: status
  end
  
  rescue_from Exception do |e|
    error(e)
  end
 
  def routing_error
    raise ActionController::RoutingError.new(params[:path])
  end
 
  protected
 
  def error(e)
    error_info = {
      :error => "internal-server-error",
      :exception => "#{e.class.name} : #{e.message}",
      :message => e.message,
    }
    error_info[:trace] = e.backtrace[0,10] if Rails.env.development?
    p error_info
    render :json => error_info.to_json, :status => 500
  end
end
