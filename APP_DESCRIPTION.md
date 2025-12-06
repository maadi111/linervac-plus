# LinerVac+ Mobile App - Description

## Overview

**LinerVac+** is a comprehensive mobile application designed for pool owners and maintenance professionals to remotely control and monitor their LinerVac+ pool vacuum and water valve automation systems. Built with React Native and Expo, the app provides seamless real-time control, live monitoring, and intelligent notifications for your pool automation equipment.

## Key Features

### 🏊 Pool Vacuum Control
- **Real-time Vacuum Management**: Instantly start or stop your pool vacuum system with a single tap
- **Double-tap Safety**: All critical controls require double-tap confirmation to prevent accidental activation
- **Visual Status Indicators**: Clear on/off states with color-coded buttons (red when off, green when on)

### 💧 Water Valve Automation
- **Remote Valve Control**: Manage your pool's water valve system from anywhere
- **Synchronized Operation**: Coordinate vacuum and valve operations for optimal pool maintenance
- **Instant Response**: Real-time command execution via secure MQTT communication

### 📹 Live Camera Monitoring
- **Live Camera Feed**: View real-time camera preview directly in the app (1/3 screen preview)
- **Full-Screen View**: Tap to expand camera view for detailed monitoring
- **Remote Camera Control**: Turn camera on/off remotely to monitor your pool area

### 🏠 Safe Home Shutdown
- **Emergency Shutdown**: Instantly shut down all systems (vacuum, water valve, camera) with the Safe Home feature
- **Safety-First Design**: Double-tap protection ensures intentional activation
- **Complete System Control**: One-button solution to return all systems to safe state

### 📱 Multi-Unit Management
- **Support for Multiple Units**: Manage up to 5 different LinerVac+ units from a single app
- **Easy Unit Switching**: Intuitive tab-based interface to switch between units
- **Quick Unit Binding**: Add new units via QR code scanning or manual UUID entry

### 🔔 Smart Notifications
- **Reed Switch Alerts**: Get notified when reed switch events occur
- **Repeating Reminders**: Automatic 15-minute reminder notifications for important alerts
- **Connection Status**: Real-time MQTT connection status indicator

### 📊 Unit Analytics & Information
- **Detailed Unit Information**: View UUID, firmware version, and device details
- **Usage Statistics**: Track data usage, power times, and operational hours
- **Session & Lifetime Tracking**: Monitor both current session and total lifetime usage hours

### 🔐 User Profile & Setup
- **Simple Onboarding**: Easy profile creation and setup process
- **QR Code Scanning**: Quick unit binding by scanning QR codes
- **Manual Entry Option**: Alternative method to bind units using UUID
- **Persistent Storage**: Your profile and unit bindings are saved locally

## Technical Highlights

### Secure Communication
- **MQTT WebSocket Integration**: Secure, real-time communication via WebSocket MQTT protocol
- **TLS/SSL Encryption**: All communications are encrypted for security
- **Cloudflare Protection**: Enterprise-grade security for MQTT broker connections

### Cross-Platform Support
- **iOS & Android**: Native apps for both iOS (13.4+) and Android platforms
- **Expo Framework**: Built with Expo for reliable, consistent performance
- **Native Modules**: Full access to device features including camera, notifications, and storage

### User Experience
- **Intuitive Interface**: Clean, modern design with pool industry aesthetic (blues, greys, light tans)
- **Responsive Design**: Optimized for various screen sizes and orientations
- **Offline Capability**: Local storage ensures your settings persist even when offline
- **Connection Monitoring**: Visual connection status indicator keeps you informed

## Target Audience

- **Pool Owners**: Homeowners who want convenient remote control of their pool automation systems
- **Pool Maintenance Professionals**: Service providers managing multiple pool installations
- **Property Managers**: Facilities managers overseeing multiple pool units
- **Tech-Savvy Pool Enthusiasts**: Users who appreciate smart home automation and IoT integration

## Use Cases

1. **Remote Pool Maintenance**: Start vacuum cleaning while away from home
2. **Water Management**: Control water valve operations to optimize pool water levels
3. **Security Monitoring**: Use live camera feed to monitor pool area
4. **Multi-Location Management**: Control multiple pool units across different properties
5. **Emergency Response**: Quickly shut down all systems in case of emergency
6. **Maintenance Tracking**: Monitor usage statistics and operational hours for maintenance scheduling

## Platform Requirements

- **iOS**: iOS 13.4 or later
- **Android**: Android 7.0 (API level 24) or later
- **Internet Connection**: Required for MQTT communication and real-time control

## Design Philosophy

LinerVac+ is designed with safety, simplicity, and reliability in mind. The double-tap confirmation for critical controls prevents accidental operations, while the intuitive interface ensures users can manage their pool systems without technical expertise. The app prioritizes real-time responsiveness and clear visual feedback, making pool automation accessible to everyone.

---

**Version**: 1.0.0  
**Package**: com.linervac.plus  
**Support**: support@linervac.com

