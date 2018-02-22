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


COPY config.json ${VERTICLE_HOME}/config.json

# Setup the cluster Hazelcast configuration
COPY cluster.xml ${VERTICLE_HOME}/cluster.xml

# Copies the starting verticles to the home directory
COPY $VERTICLE_NAME $VERTICLE_HOME/$VERTICLE_NAME
# Copies the sub-verticles into a verticles directory
COPY verticles $VERTICLE_HOME/verticles

COPY Gemfile $VERTICLE_HOME/Gemfile


# Current workaround to make bundler function
ENV PATH=$PATH:/root/.gem/jruby/2.3.0/bin

#Install bundler
RUN java -jar ${VERTX_HOME}/lib/jruby-complete-9.1.13.0.jar -S gem install --user-install --no-document bundler

# Show gems list so we can confirm bundler is installed
RUN java -jar ${VERTX_HOME}/lib/jruby-complete-9.1.13.0.jar -S gem list -d

RUN java -jar ${VERTX_HOME}/lib/jruby-complete-9.1.13.0.jar -S bundle install --path=${VERTICLE_HOME}/bundle --binstubs --gemfile=$VERTICLE_HOME/Gemfile

# Use this when you want to test the path resolution of the search for bundle 
# RUN java -Djruby.debug.scriptResolution=true -jar ${VERTX_HOME}/lib/jruby-complete-9.1.13.0.jar -S bundle install --path=${VERTICLE_HOME}/bundle --binstubs --gemfile=$VERTICLE_HOME/Gemfile


# Starts the starting verticle in the home directory
WORKDIR $VERTICLE_HOME
ENTRYPOINT ["sh", "-c"]
# CMD ["exec vertx run $VERTICLE_NAME -cp $VERTICLE_HOME/* $VERTX_ARGS"]
CMD ["exec vertx run $VERTICLE_NAME -cp $VERTICLE_HOME/* -conf config.json $VERTX_ARGS"]


