# 🔌 Hardware Setup Guide - LinerVac+

This guide will help you connect physical hardware to your Raspberry Pi for testing with the mobile app.

---

## 📋 GPIO Pin Mappings (From Your Node-RED Flow)

Based on your Node-RED configuration:

| Component | GPIO Pin | Physical Pin | Type | Mode | Description |
|-----------|----------|--------------|------|------|-------------|
| **Reed Switch** | GPIO 23 | Pin 16 | Input | PUD_UP | N/C (Normally Closed), 0=closed, 1=open |
| **Camera LED** | GPIO 24 | Pin 18 | Output | Active HIGH | Blinks when camera ON |
| **Fan** | GPIO 27 | Pin 13 | Output | Active HIGH | Controls fan relay/motor |
| **Water Valve** | GPIO 17 | Pin 11 | Output | Active HIGH | Controls valve solenoid |
| **Shutdown** | GPIO 3 | Pin 5 | Output | Active LOW | Hold LOW 5s to shutdown |

---

## 🔧 Phase 1: Testing with LEDs (Safe & Simple)

Before connecting actual hardware, test with LEDs to verify everything works!

### What You Need

- Raspberry Pi (already have)
- 4x LEDs (any color, recommend red, green, blue, yellow)
- 4x 220Ω resistors (or 330Ω)
- Breadboard
- Jumper wires (Male-to-Female)
- 1x Push button or switch (for reed switch simulation)

### LED Test Circuit

```
┌─────────────────────────────────────────────┐
│         Raspberry Pi GPIO Header            │
│                                             │
│  Pin 11 (GPIO 17) ──┬──[220Ω]──[LED]──GND  │  Water Valve LED
│  Pin 13 (GPIO 27) ──┼──[220Ω]──[LED]──GND  │  Fan LED
│  Pin 18 (GPIO 24) ──┼──[220Ω]──[LED]──GND  │  Camera LED
│  Pin 5  (GPIO 3)  ──┼──[220Ω]──[LED]──GND  │  Shutdown LED
│  Pin 16 (GPIO 23) ──┴──[Button]──────GND   │  Reed Switch
│                                             │
│  Pin 6, 9, 14, 20 = GND (use any)          │
└─────────────────────────────────────────────┘
```

### Step-by-Step LED Connection

#### 1. Water Valve LED (GPIO 17)
```
GPIO 17 (Pin 11) → 220Ω Resistor → LED (+) → LED (-) → GND (Pin 9)
```

#### 2. Fan LED (GPIO 27)
```
GPIO 27 (Pin 13) → 220Ω Resistor → LED (+) → LED (-) → GND (Pin 14)
```

#### 3. Camera LED (GPIO 24)
```
GPIO 24 (Pin 18) → 220Ω Resistor → LED (+) → LED (-) → GND (Pin 20)
```

#### 4. Shutdown LED (GPIO 3)
```
GPIO 3 (Pin 5) → 220Ω Resistor → LED (+) → LED (-) → GND (Pin 6)
```

#### 5. Reed Switch Button (GPIO 23)
```
GPIO 23 (Pin 16) → Push Button → GND (Pin 6)

Note: No resistor needed - Node-RED uses internal PULL-UP
Button pressed = 0 (closed), Button released = 1 (open)
```

---

## 🧪 Testing with LEDs

### Test 1: Camera Control

**In Mobile App:**
1. Tap Camera toggle ON
2. **LED on GPIO 24 should BLINK** (1s on, 1s off)
3. Tap Camera toggle OFF
4. LED should turn off

**In Node-RED Debug:**
```
linervac/camera/set → true
linervac/led/set → 1
```

### Test 2: Fan Control

**In Mobile App:**
1. Tap Fan toggle ON
2. **LED on GPIO 27 should turn ON** (solid)
3. Tap Fan toggle OFF
4. LED should turn off

**In Node-RED Debug:**
```
linervac/fan/set → true
```

### Test 3: Water Valve Control

**In Mobile App:**
1. Tap Water Valve toggle ON
2. **LED on GPIO 17 should turn ON** (solid)
3. Tap Water Valve toggle OFF
4. LED should turn off

**In Node-RED Debug:**
```
linervac/valve/set → true
```

### Test 4: Reed Switch (Button)

**Physical Action:**
1. Press and hold the button (simulates reed switch closing)
2. **Both Fan LED and Valve LED should turn ON automatically**
3. Release button
4. Both LEDs should turn off

**In Mobile App:**
- Status screen should show: Reed: "closed" (when pressed)
- Status screen should show: Reed: "open" (when released)

**In Node-RED Debug:**
```
linervac/reed/state → closed
linervac/fan/set → true
linervac/valve/set → true
```

### Test 5: Shutdown Sequence

**In Mobile App:**
1. Tap "Shutdown (Hold 5s)" button
2. Hold for 5 seconds
3. **LED on GPIO 3 should turn ON during hold**
4. After 5s, all control LEDs should turn off

---

## ⚡ Phase 2: Connecting Actual Hardware

**⚠️ CAUTION: Working with relays and high voltage! Follow safety procedures!**

### Safety Checklist

- [ ] **POWER OFF** Raspberry Pi before connecting hardware
- [ ] Use **optocoupler/relay modules** for isolation
- [ ] **Never** connect AC voltage directly to GPIO
- [ ] Use **5V relay boards** with GPIO signal input
- [ ] Verify **current requirements** don't exceed GPIO limits (max 16mA per pin)
- [ ] Add **flyback diodes** for inductive loads (motors, solenoids)

### Recommended Relay Module

Use **5V Relay Module** with:
- VCC → Pi 5V (Pin 2 or 4)
- GND → Pi GND (Pin 6)
- IN1-IN4 → GPIO pins (17, 27, 24, 3)
- Relay contacts → Your devices (pump, valve, fan, etc.)

```
┌─────────────────────────────────────────────┐
│         4-Channel 5V Relay Module           │
│                                             │
│  VCC ←──────────── 5V (Pin 2)              │
│  GND ←──────────── GND (Pin 6)             │
│  IN1 ←──────────── GPIO 17 (Valve)         │
│  IN2 ←──────────── GPIO 27 (Fan)           │
│  IN3 ←──────────── GPIO 24 (Camera/LED)    │
│  IN4 ←──────────── GPIO 3 (Shutdown)       │
│                                             │
│  Relay 1 NO/NC ───→ Water Valve Solenoid   │
│  Relay 2 NO/NC ───→ Fan/Pump Motor         │
│  Relay 3 NO/NC ───→ Camera Power/LED       │
│  Relay 4 NO/NC ───→ Shutdown Circuit       │
└─────────────────────────────────────────────┘
```

### Actual Component Connections

#### 1. Water Valve (Solenoid)
```
Pi GPIO 17 → Relay IN1
Relay 1 COM → 12V Power Supply (+)
Relay 1 NO → Solenoid (+)
Solenoid (-) → Power Supply (-)
```

**Specs:**
- Typical: 12V DC solenoid valve
- Current: 0.5-2A
- Use normally open (NO) contact

#### 2. Fan/Pump
```
Pi GPIO 27 → Relay IN2
Relay 2 COM → 12V Power Supply (+)
Relay 2 NO → Motor (+)
Motor (-) → Power Supply (-)
```

**Specs:**
- Typical: 12V DC fan/pump
- Current: 1-5A (check your device)
- Add flyback diode across motor terminals

#### 3. Camera/LED Indicator
```
Pi GPIO 24 → Relay IN3
Relay 3 COM → 12V/5V Power Supply (+)
Relay 3 NO → Camera Power (+)
Camera (-) → Power Supply (-)
```

**Alternative (for LED only):**
```
GPIO 24 → 220Ω Resistor → LED (+) → LED (-) → GND
(No relay needed for simple LED)
```

#### 4. Reed Switch (Magnetic)
```
GPIO 23 (Pin 16) → Reed Switch Terminal 1
Reed Switch Terminal 2 → GND (Pin 6)
```

**Specs:**
- Normally Closed (N/C) reed switch
- When magnet present: contacts closed (GPIO reads 0)
- When magnet absent: contacts open (GPIO reads 1)
- No external resistor needed (using internal PULL-UP)

---

## 🔌 Complete Wiring Diagram

```
                    RASPBERRY PI
                   GPIO Header
                ┌─────────────────┐
         3.3V ──┤ 1           2 ├── 5V ────┬─→ Relay Module VCC
    (Shutdown) ──┤ 3 (GPIO 3)  4 ├── 5V    │
          GND ──┤ 5           6 ├── GND ───┴─→ Relay Module GND
                ├─ 7           8 ┤
          GND ──┤ 9          10 ┤
  (Valve) OUT ──┤11 (GPIO 17)12 ┤           Relay Module
  (Fan) OUT ────┤13 (GPIO 27)14 ├── GND     ┌──────────────┐
                ├─15          16 ┤── (Reed)  │ IN1 ← GPIO17 │
          GND ──┤17          18 ├── (Camera) │ IN2 ← GPIO27 │
                ├─19          20 ┤── GND     │ IN3 ← GPIO24 │
          GND ──┤21          22 ┤           │ IN4 ← GPIO3  │
  (Reed) IN ────┤23 (GPIO 23)24 ┤           └──────────────┘
          GND ──┤25          26 ┤
                └─────────────────┘

Reed Switch:  GPIO 23 ──┬── [Reed] ── GND
                         │
                      Magnet brings together
```

---

## 📝 Hardware Testing Checklist

### Pre-Connection Checks
- [ ] Raspberry Pi powered OFF
- [ ] All wires secure and insulated
- [ ] No shorts between GPIO pins
- [ ] Relay module has separate power supply (if needed)
- [ ] Correct voltage for each device (5V, 12V, 24V)

### Power-On Sequence
1. Connect relay module to power
2. Connect GPIO wires to relay inputs
3. Connect devices to relay outputs (POWER OFF devices first!)
4. Power on Raspberry Pi
5. Wait for Node-RED to start (check web interface)
6. Power on individual devices
7. Launch mobile app

### Test Sequence
- [ ] App connects to MQTT (green "Connected" badge)
- [ ] Camera toggle → Relay 3 clicks, LED blinks
- [ ] Fan toggle → Relay 2 clicks, fan spins
- [ ] Water Valve toggle → Relay 1 clicks, valve opens
- [ ] Press reed switch → Fan & valve auto-activate
- [ ] Shutdown button → All relays turn off after 5s

---

## 🐛 Troubleshooting Hardware

### LED/Relay Doesn't Activate

**Check:**
1. **GPIO pin number** - Physical pin vs GPIO number
   - GPIO 17 = Physical Pin 11 (not GPIO 11!)
2. **Node-RED gpiod connection** - Should show "connected"
3. **Relay trigger level** - Some relays are active LOW
   - If relay doesn't click, try inverting logic in Node-RED
4. **Power supply** - Relay module needs 5V

**Test GPIO directly:**
```bash
# SSH to Pi
gpio mode 17 out    # Set GPIO 17 as output
gpio write 17 1     # Turn ON
gpio write 17 0     # Turn OFF
```

### Reed Switch Always Reads Same Value

**Check:**
1. **Pull-up enabled** - Node-RED should use `PUD_UP`
2. **Switch type** - Must be N/C (Normally Closed)
3. **Wiring** - GPIO 23 to one terminal, GND to other
4. **Magnet** - Strong enough to activate reed switch

**Test reed manually:**
```bash
gpio mode 23 up     # Enable pull-up
gpio read 23        # Should show 1 (open) or 0 (closed)
```

### Camera LED Doesn't Blink

**Check:**
1. **Blink function** in Node-RED - Should have interval timer
2. **LED polarity** - Long leg (+) to resistor side
3. **Resistor value** - 220Ω to 1kΩ
4. **GPIO output** - Verify in Node-RED debug

### All Devices Activate at Once

**Issue:** GPIO pins floating at boot

**Solution:**
```bash
# Add to /boot/config.txt on Pi
gpio=17=op,dl    # GPIO 17 default LOW
gpio=27=op,dl    # GPIO 27 default LOW  
gpio=24=op,dl    # GPIO 24 default LOW
gpio=3=op,dh     # GPIO 3 default HIGH (shutdown pin)
```

---

## 📊 Expected Current Draw

| Component | Voltage | Current | Power | Notes |
|-----------|---------|---------|-------|-------|
| Raspberry Pi | 5V | 2-3A | 10-15W | With peripherals |
| Relay Module | 5V | 200-300mA | 1-1.5W | 4-channel |
| Water Solenoid | 12V | 0.5-2A | 6-24W | Depends on valve size |
| Fan/Pump | 12V | 1-5A | 12-60W | Check device specs |
| Camera/LED | 5-12V | 0.1-1A | 0.5-12W | Depends on device |
| Reed Switch | 0V | 0mA | 0W | Passive, no power |

**Total:** ~30-100W typical, use 12V 10A power supply recommended

---

## ⚙️ Advanced: Production Setup

### Enclosure Recommendations
- IP65 rated box for outdoor use
- DIN rail mounting for relay modules
- Cable glands for wire entry
- Heat dissipation for power supplies

### Power Supply Setup
- **Raspberry Pi:** 5V 3A USB-C
- **Relays & Devices:** 12V 10A switching supply
- **Backup:** UPS or battery for power outage detection

### EMI Protection
- Ferrite beads on GPIO wires
- Twisted pair for long cable runs
- Shielded cables for motor connections
- Surge protection on AC inputs

### Monitoring
- Add temperature sensor (DHT22 on GPIO 4)
- Current sensor on power lines
- Voltage monitor for battery backup

---

## 🎯 Quick Start Summary

1. **Start with LEDs** - Verify software control works
2. **Test each GPIO individually** - Use test commands
3. **Add relay module** - Isolate high voltage from Pi
4. **Connect one device at a time** - Easy to debug
5. **Test from app** - Verify end-to-end control
6. **Add reed switch last** - Test auto-control logic

---

## 📞 Safety Reminders

⚠️ **ALWAYS:**
- Power off before wiring
- Use proper gauge wire for current
- Insulate all connections
- Keep water away from electronics
- Use GFCI outlets for wet locations

⚠️ **NEVER:**
- Connect AC voltage to GPIO directly
- Exceed GPIO current limits (16mA)
- Work on live circuits
- Touch exposed terminals while powered

---

## 🎉 Success Criteria

Your hardware is working when:
- ✅ All LEDs/relays respond to app toggles
- ✅ Reed switch triggers fan & valve automatically
- ✅ Status updates show in app immediately
- ✅ Shutdown button safely powers down system
- ✅ Node-RED debug shows all MQTT messages
- ✅ No false triggers or ghost activations

---

_Stay safe and have fun building your LinerVac+ system!_ 🚀

