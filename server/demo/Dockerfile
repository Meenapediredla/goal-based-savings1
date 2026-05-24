# Build from repository root:
#   docker build -f server/demo/Dockerfile -t goal-tracker .

# ---- Frontend ----
FROM node:20-alpine AS client-build
WORKDIR /client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Backend ----
FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /app

COPY server/demo/.mvn/ .mvn
COPY server/demo/mvnw server/demo/pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY server/demo/src ./src
COPY --from=client-build /client/dist ./src/main/resources/static
RUN ./mvnw clean package -DskipTests -B

# ---- Run ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV PORT=8080
CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
