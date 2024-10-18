#!/bin/bash

tar czf test.tar.gz *
scp -i "shuttle.pem" test.tar.gz ubuntu@52.208.187.99:~/.
ssh -i "shuttle.pem" ubuntu@52.208.187.99 << 'ENDSSH'
pm2 stop test
rm -rf test
mkdir test
tar xf test.tar.gz -C test
rm test.tar.gz
cd test
# npm install
pm2 start npm --name "test" -- start
ENDSSH
