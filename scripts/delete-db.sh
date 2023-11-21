#!/bin/bash

echo "|=============== REMOVE-DB STARTED ===============|"
ROOT_PASSWD="pass"

# Must drop all tables before dropping db
mysql -u root -p$ROOT_PASSWD -e "USE cashamole; DROP TABLE users;"

# Drop db
mysql -u root -p$ROOT_PASSWD -e "DROP DATABASE cashamole;"

echo "|=============== Database Deleted ===============|"