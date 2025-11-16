# Deployment Guide

## 🚀 Deployment Options

### 1. Vercel (Recommended for Next.js)

Vercel is the official Next.js hosting platform with zero-config deployment.

#### Steps:

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/creator-payment-platform
   git push -u origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Select your repository
   - Click "Deploy"

3. **Set Environment Variables**

   - In Vercel dashboard, go to Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL`: your API endpoint
   - Redeploy

4. **Done!**
   - Your app is live on `<project>.vercel.app`

#### Benefits:

- ✅ Automatic deployments on git push
- ✅ Preview deployments on PRs
- ✅ Edge functions support
- ✅ Serverless functions
- ✅ CDN included
- ✅ Analytics included
- ✅ Free tier available

---

### 2. Netlify

Another popular static hosting with serverless functions.

#### Steps:

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy via Git**

   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Click "Deploy site"

3. **Alternative: Direct Upload**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

#### Benefits:

- ✅ Easy GitHub integration
- ✅ Automatic SSL
- ✅ Serverless functions
- ✅ Split testing
- ✅ Forms handling
- ✅ Free tier available

---

### 3. AWS (Amplify or AppRunner)

For enterprise deployments.

#### AWS Amplify:

```bash
npm install -g @aws-amplify/cli
amplify init
amplify hosting add
amplify publish
```

#### Benefits:

- ✅ Auto-scaling
- ✅ Global CDN
- ✅ Custom domains
- ✅ API Gateway integration
- ✅ Lambda functions
- ✅ DynamoDB support

---

### 4. Docker + Self-Hosted

For complete control.

#### Create Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Build and Deploy:

```bash
docker build -t creator-payment-platform .
docker run -p 3000:3000 creator-payment-platform
```

---

### 5. Traditional VPS (AWS EC2, DigitalOcean, Linode)

#### SSH into server:

```bash
ssh user@your-server-ip
```

#### Install Node.js:

```bash
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Clone and deploy:

```bash
cd /var/www
git clone https://github.com/yourusername/creator-payment-platform
cd creator-payment-platform
npm install
npm run build
```

#### Use PM2 for process management:

```bash
npm install -g pm2
pm2 start npm --name "creator-payment" -- start
pm2 startup
pm2 save
```

#### Set up Nginx reverse proxy:

```nginx
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

---

## 🔒 Production Checklist

### Before Deployment

- [ ] Environment variables set correctly
- [ ] API endpoints configured
- [ ] Database connections verified
- [ ] Authentication implemented
- [ ] HTTPS enabled
- [ ] Security headers added
- [ ] Error logging configured
- [ ] Analytics integrated
- [ ] Monitoring set up
- [ ] Backup strategy ready

### Security

```env
# .env.local (production)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### Add Security Headers

In `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
      ],
    },
  ];
}
```

### Performance Optimization

```bash
# Build analysis
npm install -g @next/bundle-analyzer

# In next.config.ts:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer({
  // ... config
})

# Run:
ANALYZE=true npm run build
```

---

## 📊 Monitoring & Logging

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

```typescript
// src/pages/_app.tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Google Analytics

```typescript
// Add to layout.tsx
import Script from 'next/script'

<Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
<Script strategy="lazyOnload">
{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
`}
</Script>
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Run lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📈 Performance Tips

1. **Image Optimization**

   ```tsx
   import Image from "next/image";

   <Image src="/path/to/image" alt="Description" width={100} height={100} />;
   ```

2. **Dynamic Imports**

   ```tsx
   const HeavyComponent = dynamic(() => import("./Heavy"), {
     loading: () => <Skeleton />,
   });
   ```

3. **Static Generation**

   ```tsx
   export const revalidate = 3600; // ISR
   ```

4. **Compression**

   - Vercel/Netlify handle this automatically
   - For self-hosted, use Gzip/Brotli

5. **CDN**
   - Use CloudFlare or Cloudfront
   - Cache static assets

---

## 🆘 Troubleshooting

### Build Error: Out of Memory

```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Port Already in Use

```bash
npm run dev -- -p 3001
```

### Environment Variables Not Loading

- Restart dev server
- Check variable names (must be prefixed with `NEXT_PUBLIC_` for client)
- Verify `.env.local` format

### CSS Not Applied in Production

- Check `postcss.config.js`
- Ensure Tailwind purge is configured
- Rebuild

---

## 📋 Post-Deployment

1. **Test Live Site**

   - Form submissions
   - Navigation
   - Dark/Light mode
   - Mobile responsiveness

2. **Monitor Performance**

   - Set up error tracking
   - Monitor uptime
   - Track performance metrics

3. **Regular Backups**

   - Database backups
   - Code backups
   - User data backups

4. **Update Dependencies**
   ```bash
   npm outdated
   npm update
   ```

---

## 🚀 Deployment Summary

| Platform     | Setup Time | Cost          | Scaling | Recommended |
| ------------ | ---------- | ------------- | ------- | ----------- |
| Vercel       | 5 min      | Free-$20/mo   | Auto    | ✅ Yes      |
| Netlify      | 5 min      | Free-$19/mo   | Auto    | ✅ Yes      |
| AWS Amplify  | 10 min     | Pay-as-you-go | Auto    | Good        |
| Docker + VPS | 30 min     | $5-20/mo      | Manual  | Good        |
| AWS EC2      | 30 min     | $10-100/mo    | Manual  | Enterprise  |

---

**Recommended**: Deploy to **Vercel** for easiest setup and best Next.js optimization.

For questions or issues, refer to the platform documentation:

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [AWS Amplify Docs](https://docs.amplify.aws)
