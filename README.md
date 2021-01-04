# Transcendence

I would recommand Visual Studio Code for this project because of the extensions marketplace has.

Useful extensions are available in the extension tab, and are marked as "workspace recommandations".
They are also listed in the `.vscode/extensions.json` file

## Running

You need to fill the `.env` file with your 42 intra application credentials before running the server.

To create a new app on the intra, go [here](https://profile.intra.42.fr/oauth/applications/new),
enter anything you want as name, image, description and website,
and set `http://localhost:3000/auth/callback` as the redirect URI. (replace `localhost:3000` with your domain in production)

Fill your `.env` file like so:

```sh
INTRA_REDIRECT_URI='...'
INTRA_CLIENT_ID='...'
INTRA_CLIENT_SECRET='...'
```

You can then run with `docker-compose up --build`.

You can start the webpack dev server (which features frontend live-reloading)
by running `docker-compose exec api ./bin/webpack-dev-server` on another terminal

You can start the rails console with `docker-compose exec api rails console`

## Links

- [Difference between a library and a framework](https://www.programcreek.com/2011/09/what-is-the-difference-between-a-java-library-and-a-framework/)
- [ActiveModel basics](https://guides.rubyonrails.org/active_model_basics.html)
- [Webpack](https://webpack.js.org/)
- [Webpacker](https://github.com/rails/webpacker)
- [lit-html](https://github.com/polymer/lit-html)
- [BackboneJS](https://backbonejs.org/)
- [JQuery](https://jquery.com/)
- [Getting started with Rails](https://guides.rubyonrails.org/getting_started.html)
- [Ruby on Rails tutorial](https://www.tutorialspoint.com/ruby-on-rails/ruby-on-rails-tutorial.pdf)
- [ActionController overview](https://edgeguides.rubyonrails.org/action_controller_overview.html)
- [ActionCable overview](https://guides.rubyonrails.org/action_cable_overview.html)
- [What are websockets](https://www.html5rocks.com/en/tutorials/websockets/basics/)
- [JavaScript ES6 (the current version implemented by browsers)](https://www.tutorialspoint.com/es6/index.htm)
- [Yarn package manager (JS)](https://yarnpkg.com/getting-started/usage)
- [Bundler package manager (Ruby)](https://bundler.io/)
- [ActiveRecord migrations](https://edgeguides.rubyonrails.org/active_record_migrations.html)
- [Rails routing](https://guides.rubyonrails.org/routing.html)
- [ActiveJob basics](https://edgeguides.rubyonrails.org/active_job_basics.html)
- [ActiveRecord associations](https://guides.rubyonrails.org/association_basics.html)
- [OAuth intra.42.fr](https://api.intra.42.fr/apidoc/guides/getting_started)
- [Webpack CSS Modules](https://github.com/css-modules/css-modules)
