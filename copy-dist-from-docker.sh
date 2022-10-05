#/bin/bash
id=$(docker create clickerheroescalculator)
docker cp $id:/usr/src/app/dist ./dist
docker rm -v $id
