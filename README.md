<div align="center">

# VEIL

> Concealed in plain sight.

VEIL is a cryptographic steganography web application for securely hiding files inside PNG images.

It combines **AES-256-GCM authenticated encryption**, **Scrypt key derivation**, and **RGB LSB steganography** to conceal encrypted files inside ordinary carrier images.

## Features

- 🔐 AES-256-GCM encryption
- 🧬 Scrypt key derivation
- 🖼️ RGB LSB steganography
- 📦 Arbitrary file payloads
- 📊 Carrier capacity calculation
- 🔎 Payload integrity validation
- ⌨️ Hidden command terminal
- 🎞️ GSAP animations
- 🌊 Lenis smooth scrolling
- 🔊 Web Audio API effects
- 📱 Responsive interface

## Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-2026?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-2026?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-2026?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-2026?style=flat-square&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-2026?style=flat-square&logo=greensock&logoColor=white)

### Backend

![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=flat-square&logo=fastapi&logoColor=white)
![Cryptography](https://img.shields.io/badge/AES--256--GCM-black?style=flat-square)

## Cryptography

| Component | Implementation |
|---|---|
| Encryption | AES-256-GCM |
| Key Derivation | Scrypt |
| Salt | Random 16-byte salt |
| Nonce | Random 12-byte nonce |
| Steganography | RGB LSB |
| Integrity | GCM authentication |

## Command Terminal

Open the hidden terminal with:

```text
Ctrl + Shift + K
```

On macOS:

```text
Cmd + Shift + K
```

Available commands include:

```text
genpass [length]
show time
veil
status
cat
clear
exit
```

## How It Works

```text
Secret File
    ↓
Scrypt
    ↓
AES-256-GCM
    ↓
Encrypted Payload
    ↓
RGB LSB Embedding
    ↓
VEIL PNG
```

## License

MIT License.
