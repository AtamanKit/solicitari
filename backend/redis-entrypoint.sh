#!/bin/sh
exec redis-server --requirepass ${REDIS_PASSWORD} --masterauth ${REDIS_PASSWORD} --appendonly yes
