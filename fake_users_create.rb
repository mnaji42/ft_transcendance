def create_fake
  [["Stéphanie", "de Monaco", "smonaco", false, "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/St%C3%A9phanie_van_Monaco_%281986%29.jpg/220px-St%C3%A9phanie_van_Monaco_%281986%29.jpg"],
    ["Donald", "Trump", "dtrump", true, "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/220px-Donald_Trump_official_portrait.jpg"],
    ["Emmanuel", "Macron", "emacron", true, "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Emmanuel_Macron_in_2019.jpg/220px-Emmanuel_Macron_in_2019.jpg"],
    ["Léonardo", "DiCaprio", "ldicaprio", false, "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Leonardo_Dicaprio_Cannes_2019.jpg/220px-Leonardo_Dicaprio_Cannes_2019.jpg"],
    ["Roseline", "Bachelot", "rbachelot", false, "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Roselyne_Bachelot_-_Narquin.jpg/220px-Roselyne_Bachelot_-_Narquin.jpg"],
    ["Winnie", "l'Ourson", "wourson", false, "https://i1.wp.com/metro.co.uk/wp-content/uploads/2016/07/elib_7085634.jpg"],
    ["Mickey", "Mouse", "mmouse", false, "https://s7.orientaltrading.com/is/image/OrientalTrading/13612583"],
  ].map do |(first, last, login, admin, avatar)|
    User.create(
      :admin => admin,
      :avatar_url => avatar,
      :displayname => first + " " + last,
      :default_settings => false,
      :email => "#{login}@example.com",
      :login => login,
      :first_name => first,
      :last_name => last,
      :fake => true,
      :status => :offline,
    )
    login
  end
end
