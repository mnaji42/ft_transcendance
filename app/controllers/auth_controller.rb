class AuthController < ApplicationController
  skip_before_action :require_user, only: [:callback, :get_url, :validateGAuth, :disconnect, :fake_connect]
  skip_before_action :require_not_banned, only: [:get, :callback, :get_url, :validateGAuth, :disconnect, :fake_connect]

  def get_url
    state = SecureRandom.hex(64)
    session[:oauth_state] = state

    url = "https://api.intra.42.fr/oauth/authorize?" +
      "client_id=#{AuthHelper.client_id}&" +
      "redirect_uri=#{ERB::Util.url_encode(AuthHelper.redirect_uri)}&" +
      "response_type=code&" +
      "state=#{state}"

    render :json => {
      :url => url,
    }
  end

  def callback
    if params[:state] != session[:oauth_state]
      head :forbidden
      return
    end

    user = AuthHelper.create_user(params[:code], params[:state])
    session[:user_id] = user.id
    session[:need_2fa] = user.mfa_enabled
    cookies.encrypted[:user_id] = user.id
    cookies.encrypted[:need_2fa] = user.mfa_enabled

    if user.mfa_enabled
      redirect_to '/2fa'
    else
      redirect_to '/'
    end
  end

  def get
    json_response(current_user)
  end

  def gauthQR
    current_user.set_google_secret
    current_user.mfa_enabled = false
    json_response(:url => current_user.google_qr_uri)
    current_user.save!
  end

  def setupGAuth
    if current_user.google_authentic?(params[:pin])
      current_user.mfa_enabled = true
      current_user.save!
      json_response(:ok => true)
    else
      json_response({ :ok => false, :message => 'Invalid PIN code' }, :forbidden)
    end
  end

  def removeGAuth
    unless current_user.mfa_enabled
      json_response({ :ok => false, :message => '2FA is not enabled on your account' }, :bad_request)
      return
    end

    current_user.mfa_enabled = false
    current_user.save!
    json_response(:ok => true)
  end

  def validateGAuth
    unless session[:need_2fa]
      json_response({ :ok => false, :message => '2FA is not enabled on your account' }, :bad_request)
      return
    end

    if current_user(false).google_authentic?(params[:pin])
      cookies.encrypted[:need_2fa] = false
      session[:need_2fa] = false
      json_response(:ok => true)
    else
      json_response({ :ok => false, :message => 'Invalid PIN code' }, :forbidden)
    end
  end

  def disconnect
    cookies.encrypted[:need_2fa] = nil
    cookies.encrypted[:user_id] = nil
    session[:need_2fa] = nil
    session[:user_id] = nil
  end

  def fake_connect
    user = User.find_by(login: params[:login])
    raise "User is not marked fake!" if !user.fake
    session[:user_id] = user.id
    session[:need_2fa] = false
    cookies.encrypted[:user_id] = user.id
    cookies.encrypted[:need_2fa] = false
  end
end
