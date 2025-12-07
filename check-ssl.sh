#!/bin/bash

echo "🔍 ตรวจสอบปัญหา SSL..."
echo ""

# 1. ตรวจสอบ DNS
echo "1️⃣ ตรวจสอบ DNS:"
nslookup blurhour.metalabsoft.com
echo ""

# 2. ตรวจสอบ containers
echo "2️⃣ ตรวจสอบ Docker containers:"
docker ps | grep blur-hour
echo ""

# 3. ตรวจสอบ ports
echo "3️⃣ ตรวจสอบ ports 80 และ 443:"
netstat -tulpn | grep -E ':(80|443)' || ss -tulpn | grep -E ':(80|443)'
echo ""

# 4. ตรวจสอบ Caddy logs
echo "4️⃣ Caddy logs (10 บรรทัดล่าสุด):"
docker logs blur-hour-caddy --tail 10
echo ""

# 5. ทดสอบเชื่อมต่อ
echo "5️⃣ ทดสอบเชื่อมต่อ HTTP:"
curl -I http://blurhour.metalabsoft.com 2>&1 | head -5
echo ""

echo "6️⃣ ทดสอบเชื่อมต่อ HTTPS:"
curl -I https://blurhour.metalabsoft.com 2>&1 | head -5
echo ""

echo "✅ เสร็จสิ้น"
