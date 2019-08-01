#!/bin/bash

# 设置本地host
ip_address="127.0.0.1"
host_name=$LOCAL_HOSTNAME
matches_in_hosts="$(grep -n $host_name /etc/hosts | cut -f1 -d:)"
host_entry="${ip_address} ${host_name}"
if [ ! -z "$matches_in_hosts" ]
then
    while read -r line_number; do
        sudo sed -i '' "${line_number}s/.*/${host_entry} /" /etc/hosts
    done <<< "$matches_in_hosts"
else
    echo "$host_entry" | sudo tee -a /etc/hosts > /dev/null
fi
# 启动项目
npm run dev:start