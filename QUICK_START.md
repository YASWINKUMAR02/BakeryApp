# 🚀 Quick Start Guide - Production Deployment

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] Docker and Docker Compose installed
- [ ] Domain name registered and DNS configured
- [ ] SSL certificate (or ready to use Let's Encrypt)
- [ ] MySQL database (local or managed service)
- [ ] SMTP email credentials (Gmail, SendGrid, etc.)
- [ ] Razorpay account with KYC completed
- [ ] Production server or cloud hosting

---

## 5-Minute Local Test

Test the production setup locally before deploying:

### 1. Clone and Setup

```bash
# Navigate to project
cd BakeryApp

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` with your credentials:

```env
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=$(openssl rand -base64 64)
RAZORPAY_KEY_ID=your_test_key
RAZORPAY_KEY_SECRET=your_test_secret
# ... other variables
```

### 3. Start Services

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### 4. Verify

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend
curl http://localhost:80

# Database
docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
```

### 5. Test Application

Open browser:
- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- Swagger: http://localhost:8080/swagger-ui.html

---

## Production Deployment (30 Minutes)

### Step 1: Server Setup (5 min)

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

### Step 2: SSL Certificate (10 min)

```bash
# Install Certbot
sudo apt-get install certbot -y

# Stop any service on port 80
sudo systemctl stop nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Convert to PKCS12
sudo openssl pkcs12 -export \
  -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem \
  -inkey /etc/letsencrypt/live/yourdomain.com/privkey.pem \
  -out /opt/bakery/keystore.p12 \
  -name tomcat \
  -passout pass:your_keystore_password
```

### Step 3: Database Setup (5 min)

```bash
# Create database
mysql -u root -p <<EOF
CREATE DATABASE bakery_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bakery_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON bakery_db.* TO 'bakery_user'@'%';
FLUSH PRIVILEGES;
EOF

# Run optimizations
mysql -u bakery_user -p bakery_db < database/optimization_indexes.sql
```

### Step 4: Configure Environment (5 min)

```bash
# Create production .env
cat > .env <<EOF
# Database
DATABASE_URL=jdbc:mysql://localhost:3306/bakery_db
DB_USERNAME=bakery_user
DB_PASSWORD=your_secure_password

# JWT (generate with: openssl rand -base64 64)
JWT_SECRET=your_generated_secret_here

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Admin
ADMIN_EMAIL=admin@yourdomain.com

# Razorpay LIVE
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_live_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# URLs
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com

# SSL
SSL_ENABLED=true
SSL_KEYSTORE_PATH=/opt/bakery/keystore.p12
SSL_KEYSTORE_PASSWORD=your_keystore_password
EOF
```

### Step 5: Deploy (5 min)

```bash
# Pull latest code
git pull origin main

# Build and start
docker-compose -f docker-compose.yml up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 6: Verify Production (2 min)

```bash
# Health check
curl https://yourdomain.com/actuator/health

# Test API
curl https://yourdomain.com/api/items

# Check SSL
curl -I https://yourdomain.com
```

---

## Post-Deployment Tasks

### 1. Configure Razorpay Webhook

1. Log in to Razorpay Dashboard
2. Go to Settings → Webhooks
3. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay/payment-event`
4. Select events: payment.authorized, payment.captured, payment.failed, order.paid
5. Copy webhook secret to `.env`

### 2. Set Up Monitoring

```bash
# Enable Actuator metrics
curl https://yourdomain.com/actuator/metrics

# Set up uptime monitoring (UptimeRobot, Pingdom)
# Monitor: https://yourdomain.com/actuator/health
```

### 3. Configure Backups

```bash
# Create backup script
cat > /opt/bakery/backup.sh <<'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u bakery_user -p bakery_db > /backups/bakery_$DATE.sql
find /backups -name "bakery_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/bakery/backup.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /opt/bakery/backup.sh" | crontab -
```

### 4. Security Hardening

```bash
# Configure firewall
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable

# Disable root SSH
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

---

## Troubleshooting

### Backend Won't Start

```bash
# Check logs
docker-compose logs backend

# Check database connection
docker-compose exec backend sh -c "nc -zv mysql 3306"

# Restart service
docker-compose restart backend
```

### Frontend Not Loading

```bash
# Check logs
docker-compose logs frontend

# Check nginx config
docker-compose exec frontend nginx -t

# Restart
docker-compose restart frontend
```

### Database Connection Issues

```bash
# Check MySQL is running
docker-compose ps mysql

# Check credentials
docker-compose exec mysql mysql -u bakery_user -p

# Reset password if needed
docker-compose exec mysql mysql -u root -p -e "ALTER USER 'bakery_user'@'%' IDENTIFIED BY 'new_password';"
```

### SSL Certificate Issues

```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Verify keystore
keytool -list -v -keystore /opt/bakery/keystore.p12 -storepass your_password
```

---

## Maintenance Commands

```bash
# View all logs
docker-compose logs -f

# Restart all services
docker-compose restart

# Stop all services
docker-compose down

# Update and restart
git pull && docker-compose up -d --build

# Database backup
docker-compose exec mysql mysqldump -u bakery_user -p bakery_db > backup.sql

# Clean up Docker
docker system prune -a
```

---

## Rollback Procedure

If something goes wrong:

```bash
# Stop services
docker-compose down

# Restore database
mysql -u bakery_user -p bakery_db < /backups/bakery_YYYYMMDD.sql

# Checkout previous version
git log --oneline
git checkout <previous-commit-hash>

# Rebuild and start
docker-compose up -d --build
```

---

## Success Indicators

✅ Backend health check returns `{"status":"UP"}`  
✅ Frontend loads without errors  
✅ Can register and login  
✅ Can browse products  
✅ Can add items to cart  
✅ Payment flow works (test mode)  
✅ Email notifications sent  
✅ SSL certificate valid  
✅ No errors in logs  

---

## Next Steps

1. ✅ Complete this quick start
2. 📖 Read `PRODUCTION_DEPLOYMENT_GUIDE.md` for detailed instructions
3. 🔒 Review `PRODUCTION_READY_SUMMARY.md` for security checklist
4. 🧪 Run tests: `cd bakeryapp && mvn test`
5. 📊 Set up monitoring and alerting
6. 🚀 Go live!

---

## Support

- 📧 Email: support@yourdomain.com
- 📚 Documentation: `/docs` folder
- 🐛 Issues: GitHub Issues
- 💬 Community: Discord/Slack

---

**Ready to launch? Let's go! 🚀**
