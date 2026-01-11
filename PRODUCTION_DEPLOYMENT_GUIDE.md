# 🚀 Production Deployment Guide

## Prerequisites

### Required
- Docker & Docker Compose installed
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)
- MySQL 8.0+ or managed database service
- SMTP email service credentials
- Razorpay account with KYC completed

### Recommended
- Cloud hosting (AWS, Azure, DigitalOcean, etc.)
- CDN service (Cloudflare)
- Monitoring service (Sentry, New Relic)
- Backup solution

---

## Step 1: Environment Configuration

### 1.1 Create Production Environment File

Create `.env` file in the root directory:

```bash
# Copy from template
cp .env.example .env
```

### 1.2 Configure Environment Variables

Edit `.env` with your production values:

```env
# Database
DATABASE_URL=jdbc:mysql://your-db-host:3306/bakery_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_secure_password

# JWT (Generate secure secret)
JWT_SECRET=your_very_long_and_secure_random_secret_256_bits_minimum
JWT_EXPIRATION=86400000

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@domain.com
MAIL_PASSWORD=your_app_password

# Admin
ADMIN_EMAIL=admin@yourdomain.com

# Razorpay LIVE keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Frontend
FRONTEND_URL=https://yourdomain.com

# CORS
CORS_ORIGINS=https://yourdomain.com

# SSL (if using)
SSL_ENABLED=true
SSL_KEYSTORE_PATH=/path/to/keystore.p12
SSL_KEYSTORE_PASSWORD=your_keystore_password
```

### 1.3 Generate Secure JWT Secret

```bash
# Using OpenSSL
openssl rand -base64 64
```

---

## Step 2: Database Setup

### 2.1 Create Production Database

```sql
CREATE DATABASE bakery_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bakery_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON bakery_db.* TO 'bakery_user'@'%';
FLUSH PRIVILEGES;
```

### 2.2 Run Optimization Scripts

```bash
mysql -u bakery_user -p bakery_db < database/optimization_indexes.sql
```

### 2.3 Configure Automated Backups

```bash
# Daily backup script
0 2 * * * mysqldump -u bakery_user -p bakery_db > /backups/bakery_$(date +\%Y\%m\%d).sql
```

---

## Step 3: SSL Certificate Setup

### 3.1 Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be in:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### 3.2 Convert to PKCS12 for Spring Boot

```bash
openssl pkcs12 -export \
  -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem \
  -inkey /etc/letsencrypt/live/yourdomain.com/privkey.pem \
  -out keystore.p12 \
  -name tomcat \
  -passout pass:your_keystore_password
```

---

## Step 4: Docker Deployment

### 4.1 Build Images

```bash
# Build all services
docker-compose build

# Or build individually
docker-compose build backend
docker-compose build frontend
```

### 4.2 Start Services

```bash
# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4.3 Verify Deployment

```bash
# Check backend health
curl https://yourdomain.com:8080/actuator/health

# Check frontend
curl https://yourdomain.com

# Check database connection
docker-compose exec backend sh -c "wget -qO- http://localhost:8080/actuator/health"
```

---

## Step 5: Nginx Reverse Proxy (Optional)

### 5.1 Install Nginx

```bash
sudo apt-get install nginx
```

### 5.2 Configure Nginx

Create `/etc/nginx/sites-available/bakery`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeout for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 5.3 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/bakery /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 6: Razorpay Configuration

### 6.1 Complete KYC

1. Log in to Razorpay Dashboard
2. Complete KYC verification
3. Wait for approval (usually 24-48 hours)

### 6.2 Generate Live API Keys

1. Go to Settings → API Keys
2. Generate Live Keys
3. Update `.env` with live keys

### 6.3 Configure Webhooks

1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay/payment-event`
3. Select events:
   - payment.authorized
   - payment.captured
   - payment.failed
   - order.paid
4. Copy webhook secret to `.env`

---

## Step 7: Monitoring & Logging

### 7.1 Set Up Application Monitoring

```bash
# Install Sentry (optional)
# Add to pom.xml:
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter</artifactId>
    <version>6.30.0</version>
</dependency>

# Configure in application-prod.properties:
sentry.dsn=your_sentry_dsn
sentry.environment=production
```

### 7.2 Configure Log Aggregation

```yaml
# docker-compose.yml - Add logging driver
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### 7.3 Set Up Uptime Monitoring

- Use UptimeRobot, Pingdom, or similar
- Monitor: `https://yourdomain.com/actuator/health`
- Alert on downtime

---

## Step 8: Performance Optimization

### 8.1 Enable Caching

```bash
# Install Redis
docker run -d --name redis -p 6379:6379 redis:alpine

# Update docker-compose.yml to include Redis
```

### 8.2 Configure CDN

1. Sign up for Cloudflare (free tier available)
2. Add your domain
3. Update DNS to Cloudflare nameservers
4. Enable caching and optimization features

### 8.3 Database Tuning

```sql
-- Run optimization script
source database/optimization_indexes.sql;

-- Monitor slow queries
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

---

## Step 9: Security Hardening

### 9.1 Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 9.2 Disable Swagger in Production

In `application-prod.properties`:

```properties
springdoc.swagger-ui.enabled=false
springdoc.api-docs.enabled=false
```

### 9.3 Regular Security Updates

```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

---

## Step 10: Testing & Validation

### 10.1 Run Production Tests

```bash
# Test backend health
curl https://yourdomain.com/actuator/health

# Test API endpoints
curl https://yourdomain.com/api/items

# Test payment flow (use test mode first)
```

### 10.2 Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 https://yourdomain.com/api/items

# Using Artillery
npm install -g artillery
artillery quick --count 10 --num 50 https://yourdomain.com
```

### 10.3 Security Scan

```bash
# SSL test
https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com

# Security headers
https://securityheaders.com/?q=yourdomain.com
```

---

## Maintenance

### Daily Tasks
- Monitor application logs
- Check error rates
- Review performance metrics

### Weekly Tasks
- Review security alerts
- Check disk space
- Verify backups

### Monthly Tasks
- Update dependencies
- Review and optimize database
- Security audit
- Performance review

---

## Rollback Procedure

If deployment fails:

```bash
# Stop services
docker-compose down

# Restore from backup
mysql -u bakery_user -p bakery_db < /backups/bakery_YYYYMMDD.sql

# Revert to previous version
git checkout previous-tag
docker-compose build
docker-compose up -d
```

---

## Support & Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify database is running
   - Check firewall rules

2. **SSL Certificate Errors**
   - Verify certificate paths
   - Check certificate expiry
   - Ensure proper permissions

3. **Payment Gateway Issues**
   - Verify Razorpay keys
   - Check webhook configuration
   - Review payment logs

### Getting Help

- Check application logs: `docker-compose logs -f backend`
- Review error tracking dashboard (Sentry)
- Contact support: support@yourdomain.com

---

## Checklist

Before going live:

- [ ] Environment variables configured
- [ ] Database optimized and backed up
- [ ] SSL certificate installed
- [ ] Docker services running
- [ ] Nginx configured (if using)
- [ ] Razorpay KYC completed
- [ ] Webhooks configured
- [ ] Monitoring set up
- [ ] CDN configured
- [ ] Security hardening complete
- [ ] Load testing passed
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on deployment

---

**Congratulations! Your bakery application is now production-ready! 🎉**
