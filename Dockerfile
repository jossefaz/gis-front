# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:15.2.1


# Install and configure `serve`.
RUN yarn global add serve
CMD serve -s build
EXPOSE 5000

# Install all dependencies of the current project.
COPY package.json package.json
RUN yarn

# Copy all local files into the image.
COPY . .

# Build for production.
#RUN yarn run build --production

FROM nginx

EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html