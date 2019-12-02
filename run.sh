konsole -title "node server" -e "nodemon ./backend/bin/www" &
konsole -e "redis-server /etc/redis.conf"
konsole -title "cors proxy" -e "nodemon ./backend/proxy/cors.js" &
konsole -e "npm start electron ./frontend/electron" &
konsole -title "redsmin ssh" -e "sudo npm install redsmin@latest -g && REDSMIN_KEY=5de51c1fc78f3e0f3b6ac6aa redsmin" &