# 🔧 Configure Mosquitto for Dual Protocol (WebSocket + TCP)

This guide will help you configure your MQTT broker to support **both** protocols:
- **WebSocket** (wss://) for mobile app and web clients
- **TCP MQTT** for command-line tools (mosquitto_pub/sub)

---

## 📋 Prerequisites

You need Mosquitto installed on your **server/Pi** (not your local dev machine):

```bash
# On your Pi/server, install Mosquitto
sudo apt update
sudo apt install mosquitto mosquitto-clients
```

---

## 🔧 Configuration Steps

### Step 1: Backup Existing Config

```bash
# SSH into your Pi/server
ssh user@mqtt.linervac.com

# Backup current config
sudo cp /etc/mosquitto/mosquitto.conf /etc/mosquitto/mosquitto.conf.backup
```

### Step 2: Create Dual Protocol Config

Copy the provided configuration file to your server:

```bash
# On your Pi/server
sudo nano /etc/mosquitto/conf.d/linervac.conf
```

Paste this configuration:

```conf
# Mosquitto Configuration - Dual Protocol Support
# LinerVac+ MQTT Broker

# Global Settings
allow_anonymous true
persistence true
persistence_location /var/lib/mosquitto/
log_dest file /var/log/mosquitto/mosquitto.log

# ═══════════════════════════════════════════════════════════
# Listener 1: WebSocket (Port 443 or 8443)
# ═══════════════════════════════════════════════════════════

listener 8443
protocol websockets

# If using Cloudflare:
# - Cloudflare listens on 443 (public)
# - Forwards to your server port 8443 (local)
# - Configure Cloudflare to proxy WebSocket traffic

# SSL/TLS (if NOT using Cloudflare proxy)
# cafile /etc/ssl/certs/ca-certificates.crt
# certfile /etc/mosquitto/certs/fullchain.pem
# keyfile /etc/mosquitto/certs/privkey.pem

# ═══════════════════════════════════════════════════════════
# Listener 2: TCP MQTT (Port 1883 - Local/Testing)
# ═══════════════════════════════════════════════════════════

listener 1883
protocol mqtt
# Local network only (optional)
# bind_address 0.0.0.0

# ═══════════════════════════════════════════════════════════
# Listener 3: Secure TCP (Port 8883 - Remote Access)
# ═══════════════════════════════════════════════════════════

# Uncomment for secure TCP access:
# listener 8883
# protocol mqtt
# cafile /etc/ssl/certs/ca-certificates.crt
# certfile /etc/mosquitto/certs/fullchain.pem
# keyfile /etc/mosquitto/certs/privkey.pem
```

### Step 3: Configure Cloudflare (if using)

If you're using Cloudflare proxy:

1. **DNS Settings:**
   - A record: `mqtt.linervac.com` → Your server IP
   - Proxy status: **Enabled** (orange cloud)

2. **SSL/TLS Settings:**
   - Encryption mode: **Full** (or Full Strict with valid cert)
   - WebSocket: **Enabled** (under Network tab)

3. **Firewall Rules:**
   - Allow WebSocket connections
   - Allow port 8443 from Cloudflare IPs

4. **Port Forwarding:**
   - External: 443 (Cloudflare)
   - Internal: 8443 (your Mosquitto)

### Step 4: Configure Firewall

```bash
# On your Pi/server
# Allow WebSocket port (local)
sudo ufw allow 8443/tcp comment 'Mosquitto WebSocket'

# Allow TCP MQTT (local network)
sudo ufw allow 1883/tcp comment 'Mosquitto TCP'

# Allow secure TCP (optional, for remote)
# sudo ufw allow 8883/tcp comment 'Mosquitto Secure TCP'

# Check firewall status
sudo ufw status
```

### Step 5: Restart Mosquitto

```bash
# Test configuration first
sudo mosquitto -c /etc/mosquitto/conf.d/linervac.conf -v

# If OK, restart service
sudo systemctl restart mosquitto

# Check status
sudo systemctl status mosquitto

# Check logs
sudo tail -f /var/log/mosquitto/mosquitto.log
```

---

## 🧪 Testing Both Protocols

### Test 1: TCP MQTT (Command-Line)

From any machine on your network:

```bash
# Subscribe (TCP)
mosquitto_sub -h mqtt.linervac.com -p 1883 -t linervac/test -v

# Publish (TCP) - from another terminal
mosquitto_pub -h mqtt.linervac.com -p 1883 -t linervac/test -m "hello from TCP"
```

### Test 2: WebSocket MQTT (Mobile App)

From your mobile app:
```
URL: wss://mqtt.linervac.com:443/mqtt
Port: 443
Protocol: WebSocket
TLS: Enabled
```

App should show:
```
MQTT Connected successfully ✓
Subscribed to test topic ✓
```

### Test 3: Cross-Protocol Communication

**Terminal (TCP):**
```bash
mosquitto_sub -h mqtt.linervac.com -p 1883 -t linervac/camera/set -v
```

**Mobile App (WebSocket):**
- Tap Camera toggle
- Terminal should show: `linervac/camera/set true`

---

## 🔍 Troubleshooting

### Issue: WebSocket Won't Connect

**Check Cloudflare:**
```bash
# Test if Cloudflare is forwarding WebSocket
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  https://mqtt.linervac.com/mqtt
```

**Check Mosquitto Logs:**
```bash
sudo tail -f /var/log/mosquitto/mosquitto.log
# Look for: "New client connected" and "Client disconnected"
```

**Check Listener:**
```bash
# Verify Mosquitto is listening on 8443
sudo netstat -tulpn | grep 8443
# Should show: mosquitto
```

### Issue: TCP Won't Connect

**Check Port:**
```bash
# Test local connection
mosquitto_sub -h localhost -p 1883 -t test -v

# Test remote connection
mosquitto_sub -h mqtt.linervac.com -p 1883 -t test -v
```

**Check Firewall:**
```bash
sudo ufw status | grep 1883
# Should show: 1883/tcp ALLOW
```

### Issue: Both Protocols Have Same Client ID

Mosquitto will disconnect clients with duplicate IDs. Ensure:
- Mobile app uses: `linervac_app_[timestamp]`
- Command-line auto-generates unique IDs

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Network                             │
│                                                             │
│  ┌──────────────┐        ┌────────────────────────┐       │
│  │  Mobile App  │◄──wss──┤   Cloudflare Proxy     │       │
│  │ (WebSocket)  │  :443  │   (SSL Termination)    │       │
│  └──────────────┘        └────────┬───────────────┘       │
│                                    │                         │
│                                    │ :8443 (WebSocket)       │
│                                    ▼                         │
│                          ┌──────────────────────┐           │
│  ┌──────────────┐        │   Mosquitto Broker   │           │
│  │ Command-Line │◄──TCP──┤                      │           │
│  │ mosquitto_   │  :1883 │  Listener 1: :8443   │           │
│  │ pub/sub      │        │  (WebSocket)         │           │
│  └──────────────┘        │                      │           │
│                          │  Listener 2: :1883   │           │
│  ┌──────────────┐        │  (TCP MQTT)          │           │
│  │  Node-RED    │◄───────┤                      │           │
│  │  (Local)     │  :1883 │  Listener 3: :8883   │           │
│  └──────────────┘        │  (Secure TCP)        │           │
│                          └──────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Advanced Configuration

### Add Authentication

```bash
# Create password file
sudo mosquitto_passwd -c /etc/mosquitto/passwd admin
# Enter password when prompted

# Update config
sudo nano /etc/mosquitto/conf.d/linervac.conf
```

Add:
```conf
allow_anonymous false
password_file /etc/mosquitto/passwd
```

### Add Access Control (ACL)

Create `/etc/mosquitto/acl`:
```
# Admin has full access
user admin
topic readwrite #

# App can only access linervac topics
user app_user
topic readwrite linervac/#

# Anonymous can only read status
topic read linervac/status/#
```

Update config:
```conf
acl_file /etc/mosquitto/acl
```

### Monitor Connections

```bash
# Watch active clients
watch 'sudo mosquitto_sub -h localhost -p 1883 -t "$SYS/#" -C 5'

# Count connected clients
sudo mosquitto_sub -h localhost -p 1883 -t '$SYS/broker/clients/connected' -C 1
```

---

## 📝 Configuration Summary

After setup, you'll have:

| Protocol | Port | Use Case | Security |
|----------|------|----------|----------|
| **WebSocket** | 443 (public) → 8443 (local) | Mobile app, web clients | TLS via Cloudflare |
| **TCP MQTT** | 1883 | Local testing, Node-RED | None (local only) |
| **Secure TCP** | 8883 | Remote CLI tools | TLS (optional) |

---

## ✅ Verification Checklist

- [ ] Mosquitto installed on server
- [ ] Configuration file created
- [ ] Firewall rules added
- [ ] Mosquitto restarted successfully
- [ ] TCP connection works (mosquitto_pub/sub)
- [ ] WebSocket connection works (app/browser)
- [ ] Cross-protocol messages work
- [ ] Cloudflare proxy configured (if using)
- [ ] Logs show no errors

---

## 🚀 Quick Setup Script

```bash
#!/bin/bash
# Run this on your Pi/server

# Install Mosquitto
sudo apt update
sudo apt install -y mosquitto mosquitto-clients

# Backup config
sudo cp /etc/mosquitto/mosquitto.conf /etc/mosquitto/mosquitto.conf.backup

# Create new config (copy from mosquitto-dual-protocol.conf)
sudo nano /etc/mosquitto/conf.d/linervac.conf

# Configure firewall
sudo ufw allow 8443/tcp
sudo ufw allow 1883/tcp

# Restart Mosquitto
sudo systemctl restart mosquitto
sudo systemctl status mosquitto

# Test
mosquitto_sub -h localhost -p 1883 -t test -v &
sleep 1
mosquitto_pub -h localhost -p 1883 -t test -m "hello"
```

---

## 📞 Need Help?

Check logs:
```bash
sudo tail -f /var/log/mosquitto/mosquitto.log
```

Test connectivity:
```bash
# TCP
nc -zv mqtt.linervac.com 1883

# WebSocket
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  https://mqtt.linervac.com/mqtt
```

---

_Last Updated: Dec 6, 2025_

