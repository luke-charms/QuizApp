FROM node:18-alpine
RUN npm install -g nodemon
WORKDIR /app
COPY . .
RUN npm install
ENV DEBUG='quizworker:*'
ENTRYPOINT ["npm", "run", "dev"]
