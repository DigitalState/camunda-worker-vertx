# Notice the difference between VERTX_HOME and VERTICLE_HOME.  
# VERTX_HOME is the location of the vertex executable/command

# Alpine cannot be used because Jruby requires cglib to install bundler
FROM vertx/vertx3
# FROM vertx/vertx3-alpine

ENV VERTICLE_HOME /usr/verticles

COPY logging.properties ${VERTICLE_HOME}/logging.properties
ENV VERTX_JUL_CONFIG $VERTICLE_HOME/logging.properties 

# Setup Stack Manager for Vertx
COPY vertx-stack.json ${VERTX_HOME}/vertx-stack.json
# Download and resolve dependencies listed in stack manager
RUN vertx resolve && rm -rf ${HOME}/.m2 

# config.json file that will be used in the --conf argument of 'exec vertx run'
COPY config.json ${VERTICLE_HOME}/config.json

# Setup the cluster Hazelcast configuration
COPY cluster.xml ${VERTICLE_HOME}/cluster.xml

# Copies the starting verticles to the home directory
COPY $VERTICLE_NAME $VERTICLE_HOME/$VERTICLE_NAME
# Copies the sub-verticles into a verticles directory
COPY verticles $VERTICLE_HOME/verticles

# -- RUBY GEMFILE ISTALL: START --
# Copy Gemfile into VERTICLE_HOME
COPY Gemfile $VERTICLE_HOME/Gemfile

# Set Path for where bundler will get installed
# This is set before bundler install to prevent post-install warning
ENV PATH=$PATH:/root/.gem/jruby/2.3.0/bin

# Install Bundler gem
RUN java -jar ${VERTX_HOME}/lib/jruby-complete-9.1.13.0.jar -S gem install --user-install --no-document bundler

# Install gems in gemfile located in VERTICLE_HOME
# @TODO Make --path location configurable
RUN BUNDLE_SILENCE_ROOT_WARNING=true java -jar ${VERTX_HOME}/lib/jruby-complete-9.1.13.0.jar -S bundle install --path=${VERTICLE_HOME}/bundle --gemfile=$VERTICLE_HOME/Gemfile

# Print Gemfile.lock file for logging purposes, so we know what was installed by bundle install
RUN cat $VERTICLE_HOME/Gemfile.lock
# -- RUBY GEMFILE INSTALL: END --

# Starts the starting verticle in the home directory
WORKDIR $VERTICLE_HOME
ENTRYPOINT ["sh", "-c"]
# CMD ["exec vertx run $VERTICLE_NAME -cp $VERTICLE_HOME/* $VERTX_ARGS"]
CMD ["exec vertx run $VERTICLE_NAME -cp $VERTICLE_HOME/* -conf config.json $VERTX_ARGS"]


