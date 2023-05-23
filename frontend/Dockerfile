# Fetching the latest node image on alpine linux
FROM node:latest AS development 

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /cse611-spring2023-team-photo-editing

# Installing dependencies
COPY ./package.json /cse611-spring2023-team-photo-editing/
RUN npm install --force

# Copying all the files in our project
COPY . .

# Starting our application
CMD npm start