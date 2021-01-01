FROM node:14

WORKDIR /app/frontend/

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/frontend/node_modules/.bin:$PATH

# Install dependencies
ADD package.json yarn.lock /app/frontend/
RUN yarn install --silent

# Add rest of the client code
COPY . /app/frontend/

EXPOSE 3000

CMD yarn run start