FROM ruby:2.7.0

# https://docs.docker.com/compose/rails/

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && \
  apt-get install -y nodejs postgresql-client yarn
RUN mkdir /myapp
WORKDIR /myapp

COPY Gemfile .
COPY Gemfile.lock .
RUN bundle install

COPY package.json .
COPY yarn.lock .
COPY Rakefile .
COPY postcss.config.js .
COPY fake_users_create.rb .
COPY babel.config.js .
COPY .ruby-version .
COPY .browserslistrc .
COPY vendor/ ./vendor/
COPY test/ ./test/
COPY storage/ ./storage/
COPY public/ ./public/
COPY db/ ./db/
COPY bin/ ./bin/
COPY app/ ./app/
COPY config/ ./config/
RUN yarn install


# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]
