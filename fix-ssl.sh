#!/bin/bash

echo "🔧 แก้ไขปัญหา SSL..."
echo ""

# 1. หยุด containers
echo "1️⃣ หยุด containers เดิม..."
docker-compose -f docker-compose.ssl.yml down
echo ""

# 2. ลบ Caddy data (บังคับให้ขอ certificate ใหม่)
echo "2️⃣ ลบ Caddy data เก่า..."
docker volume rm blur-hour_caddy_data blur-hour_caddy_config 2>/dev/null || true
echo ""

# 3. รัน containers ใหม่
echo "3️⃣ รัน containers ใหม่..."
docker-compose -f docker-compose.ssl.yml up -d
echo ""

# 4. รอ 10 วินาที
echo "4️⃣ รอ Caddy เริ่มทำงาน..."
sleep 10
echo ""

# 5. ตรวจสอบ logs
echo "5️⃣ ตรวจสอบ Caddy logs:"
docker logs blur-hour-caddy --tail 20
echo ""

echo "✅ เสร็จสิ้น - ลองเข้า https://blurhour.metalabsoft.com"
echo ""
echo "📝 หากยังไม่ได้ ให้รัน: docker logs blur-hour-caddy -f"
