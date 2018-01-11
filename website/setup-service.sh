sudo cp -f /home/infamous/infamous/website/infamous-website.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable infamous-website.service
