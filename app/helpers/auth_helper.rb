module AuthHelper
  def AuthHelper.redirect_uri
    raise 'No REDIRECT_URI environment variable! (See README.md)' unless ENV['INTRA_REDIRECT_URI']
    return ENV['INTRA_REDIRECT_URI']
  end
  def AuthHelper.client_id
    raise 'No INTRA_CLIENT_ID environment variable! (See README.md)' unless ENV['INTRA_CLIENT_ID']
    return ENV['INTRA_CLIENT_ID']
  end
  def AuthHelper.client_secret
    raise 'No INTRA_CLIENT_SECRET environment variable! (See README.md)' unless ENV['INTRA_CLIENT_SECRET']
    return ENV['INTRA_CLIENT_SECRET']
  end

  def AuthHelper.create_user(code, state)

    # Get access token
    res_token = HTTP.post('https://api.intra.42.fr/oauth/token', :form => {
      :grant_type => 'authorization_code',
      :client_id => AuthHelper.client_id,
      :client_secret => AuthHelper.client_secret,
      :code => code,
      :state => state,
      :redirect_uri => AuthHelper.redirect_uri,
    })

    if !res_token.status.success?
      raise "Error while getting the authorization code!"
    end

    parsed_res_token = res_token.parse

    # Get user info
    res_info = HTTP.headers(:authorization => "Bearer " + parsed_res_token['access_token'])
      .get('https://api.intra.42.fr/v2/me')

    if !res_info.status.success?
      raise "Error while getting user info!"
    end

    parsed_res_info = res_info.parse

    # Add user to database
    data = {
      # Token info
      :access_token => parsed_res_token['access_token'],
      :token_type => parsed_res_token['token_type'],
      :token_expire => Time.now + parsed_res_token['expires_in'],
      :refresh_token => parsed_res_token['refresh_token'],
      :token_scope => parsed_res_token['scope'],
    }

    user = User.find_by(:login => parsed_res_info['login'])
    if !user || user.default_settings
      data = data.merge({
        # User info
        :intra_id => parsed_res_info['id'],
        :email => parsed_res_info['email'],
        :login => parsed_res_info['login'],
        :first_name => parsed_res_info['first_name'],
        :last_name => parsed_res_info['last_name'],
        :intra_url => parsed_res_info['url'],
        :intra_displayname => parsed_res_info['displayname'],
        :intra_image_url => parsed_res_info['image_url'],
        :is_intra_staff => parsed_res_info['staff?'],
        :avatar_url => parsed_res_info['image_url'],
        :displayname => parsed_res_info['displayname'],
        :default_settings => true,
      })
    end

    if user
      user.update(data)
    else
      print data
      user = User.create(data)
      user.save!
      RankHelper.recalculate
    end

    return user
  end

  def AuthHelper.update_intra_settings(id)
    user = User.find_by(:id => id)

    return nil unless user

    # Token is about to expire
    if user.token_expire >= Time.now - 10

      # Get a new token
      res_token = HTTP.post('https://api.intra.42.fr/oauth/token', :form => {
        :grant_type => 'refresh_token',
        :client_id => AuthHelper.client_id,
        :client_secret => AuthHelper.client_secret,
        :refresh_token => user.refresh_token,
        :redirect_uri => AuthHelper.redirect_uri,
      })

      puts res_token.body
      if !res_token.status.success?
        raise "Error while getting a refresh token!"
      end

      parsed_res_token = res_token.parse
  
      user.access_token = parsed_res_token['access_token'],
      user.token_type = parsed_res_token['token_type'],
      user.token_expire = Time.now + parsed_res_token['expires_in'],
      user.refresh_token = parsed_res_token['refresh_token'],
      user.token_scope = parsed_res_token['scope'],

      # Let's also refresh the user infos
      res_info = HTTP.headers(:authorization => "Bearer " + parsed_res_token['access_token'])
        .get('https://api.intra.42.fr/v2/me')

      if !res_info.status.success?
        raise "Error while getting user info!"
      end

      parsed_res_info = res_info.parse

      user.intra_id = parsed_res_info['id']
      user.email = parsed_res_info['email']
      user.login = parsed_res_info['login']
      user.first_name = parsed_res_info['first_name']
      user.last_name = parsed_res_info['last_name']
      user.intra_url = parsed_res_info['url']
      user.intra_displayname = parsed_res_info['displayname']
      user.intra_image_url = parsed_res_info['image_url']
      user.is_intra_staff = parsed_res_info['staff?']

      user.save!
    end

    return user
  end
end
