# Coolify Deployment Guide

This guide will help you deploy the College ERP system to your VPS using Coolify.

## Prerequisites

1. VPS with Coolify installed
2. Domain name pointed to your VPS
3. S3-compatible storage (AWS S3, DigitalOcean Spaces, or MinIO)

## Deployment Steps

### 1. Prepare Environment Variables

Copy `.env.production.example` to `.env` and fill in your values:

```bash
cp .env.production.example .env
```

**Important variables to configure:**
- `DB_ROOT_PASSWORD` - Strong MySQL root password
- `DB_PASSWORD` - MySQL user password
- `JWT_SECRET` - Random 32+ character string
- `JWT_REFRESH_SECRET` - Different random 32+ character string
- `AWS_S3_BUCKET` - Your S3 bucket name
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` - S3 credentials
- `NEXT_PUBLIC_API_URL` - Your API domain (e.g., https://api.yourdomain.com)

### 2. Coolify Setup

#### Option A: Using Coolify UI (Recommended)

1. **Create New Project** in Coolify
2. **Add Git Repository**: Connect your GitHub/GitLab repository
3. **Configure Services**:
   
   **Database (MySQL)**:
   - Type: MySQL 8.0
   - Database Name: `college_erp`
   - Set root password and user credentials
   
   **Redis**:
   - Type: Redis 7
   - No additional configuration needed
   
   **API Service**:
   - Build Pack: Dockerfile
   - Dockerfile Path: `apps/api/Dockerfile`
   - Port: 3001
   - Add all environment variables from `.env`
   - Health Check: `/` endpoint
   
   **Web Service**:
   - Build Pack: Dockerfile
   - Dockerfile Path: `apps/web/Dockerfile`
   - Port: 3000
   - Environment: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

4. **Configure Domains**:
   - API: `api.yourdomain.com` → Port 3001
   - Web: `yourdomain.com` → Port 3000

5. **Enable SSL**: Coolify will auto-provision Let's Encrypt certificates

#### Option B: Using Docker Compose

1. Upload `docker-compose.prod.yml` and `.env` to your VPS
2. Run:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### 3. Database Migration

After first deployment, run migrations:

```bash
# SSH into your VPS
docker exec -it college-erp-api npx prisma migrate deploy
```

### 4. Seed Initial Data

Create the Super Admin user:

```bash
docker exec -it college-erp-api npx prisma db seed
```

Default credentials:
- Email: `admin@college.com`
- Password: `admin123`

**⚠️ Change these immediately after first login!**

### 5. Configure Reverse Proxy (if not using Coolify's built-in)

If using Nginx manually:

```nginx
# API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Web
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then enable SSL with Certbot:
```bash
certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## Post-Deployment

### Health Checks

- API: `https://api.yourdomain.com/api/docs` (Swagger UI)
- Web: `https://yourdomain.com`

### Monitoring

Check logs:
```bash
docker logs -f college-erp-api
docker logs -f college-erp-web
```

### Backup Strategy

1. **Database Backups**:
   ```bash
   docker exec college-erp-db mysqldump -u root -p college_erp > backup.sql
   ```

2. **Automated Backups**: Set up cron job
   ```bash
   0 2 * * * docker exec college-erp-db mysqldump -u root -p$DB_ROOT_PASSWORD college_erp | gzip > /backups/college_erp_$(date +\%Y\%m\%d).sql.gz
   ```

## Updating the Application

1. Pull latest code
2. Rebuild containers:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
3. Run migrations if needed:
   ```bash
   docker exec -it college-erp-api npx prisma migrate deploy
   ```

## Troubleshooting

### API not connecting to database
- Check `DATABASE_URL` format
- Ensure database container is healthy: `docker ps`

### CORS errors
- Verify `NEXT_PUBLIC_API_URL` matches your API domain
- Check API CORS configuration in `main.ts`

### Build failures
- Ensure all dependencies are in `package.json`
- Check Node version compatibility (requires Node 22+)

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall (only ports 80, 443, 22)
- [ ] Set up database backups
- [ ] Use environment variables (never commit secrets)
- [ ] Enable rate limiting in production
- [ ] Configure S3 bucket permissions properly

## Support

For issues, check:
1. Container logs
2. Database connectivity
3. Environment variables
4. Network configuration
