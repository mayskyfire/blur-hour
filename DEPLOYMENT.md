# 🚀 Deployment Guide

## Railway Deployment

### Option 1: Direct Railway Deployment (Recommended)

Railway จะจัดการ SSL ให้อัตโนมัติผ่าน domain ของ Railway

1. **Push โปรเจคไปยัง GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy บน Railway**
   - ไปที่ [railway.app](https://railway.app)
   - เชื่อมต่อ GitHub repository
   - Railway จะ detect Dockerfile อัตโนมัติ

3. **ตั้งค่า Environment Variables**
   
   ใน Railway Dashboard > Variables:
   ```
   NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NODE_ENV=production
   ```

4. **เพิ่ม Custom Domain (Optional)**
   - Settings > Networking > Custom Domain
   - เพิ่ม domain ของคุณ
   - Railway จะออก SSL certificate อัตโนมัติ

### Option 2: Docker Compose with Caddy (สำหรับ VPS)

ถ้าต้องการ deploy บน VPS ของตัวเองพร้อม SSL:

1. **แก้ไข Caddyfile**
```bash
# เปลี่ยน your-domain.com และ email
nano Caddyfile
```

2. **สร้าง .env file**
```bash
cp .env.example .env
# แก้ไข .env ให้ครบถ้วน
```

3. **รัน Docker Compose**
```bash
docker-compose -f docker-compose.ssl.yml up -d
```

4. **ตรวจสอบ logs**
```bash
docker-compose -f docker-compose.ssl.yml logs -f
```

Caddy จะออก SSL certificate จาก Let's Encrypt อัตโนมัติ

### Option 3: Railway + Custom Domain + Caddy

ถ้าต้องการควบคุม SSL เอง:

1. Deploy app บน Railway (ไม่ใช้ custom domain)
2. ตั้ง VPS แยกสำหรับ Caddy
3. ใช้ Caddy reverse proxy ไปยัง Railway URL

## Firestore Security

อย่าลืม deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

## PWA Icons

ตรวจสอบว่ามี icons ครบใน `public/icons/`:
- icon-192x192.png
- icon-512x512.png

## Environment Variables สำคัญ

| Variable | Description |
|----------|-------------|
| `NUXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NUXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NUXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |
| `NODE_ENV` | production |

## Troubleshooting

### Build ล้มเหลว
```bash
# ลองสร้าง local ก่อน
npm run build
```

### Firebase connection error
- ตรวจสอบ environment variables
- ตรวจสอบ Firebase project settings

### SSL ไม่ทำงาน (Caddy)
- ตรวจสอบว่า domain ชี้ไปที่ server ถูกต้อง
- ตรวจสอบ port 80, 443 เปิดอยู่
- ดู Caddy logs: `docker logs blur-hour-caddy`

## Performance Tips

1. **Enable Compression**: Caddy จัดการให้แล้ว (gzip)
2. **Cache Static Assets**: ตั้งค่าใน Caddyfile แล้ว
3. **CDN**: พิจารณาใช้ Cloudflare หน้า Railway

## Monitoring

Railway มี built-in monitoring:
- CPU usage
- Memory usage
- Network traffic
- Logs

## Cost Estimation

Railway:
- Free tier: $5 credit/month
- Hobby plan: $5/month
- Pro plan: $20/month

VPS (DigitalOcean, Linode):
- Basic: $5-10/month
- Standard: $20-40/month
