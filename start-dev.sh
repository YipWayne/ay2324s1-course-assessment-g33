set -o allexport
source docker-compose-dev.env
set +o allexport

docker-compose -f docker-compose-dev.yml up -d judge0_db judge0_redis
sleep 10s
docker-compose -f docker-compose-dev.yml up
sleep 5s