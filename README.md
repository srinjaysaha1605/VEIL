# VEIL

> Concealed in plain sight.

VEIL is a cryptographic steganography web application for securely hiding files inside PNG images.

It combines authenticated encryption with RGB least-significant-bit (LSB) steganography, allowing an encrypted payload to be embedded inside an ordinary-looking carrier image.

## Features

- 🔐 **AES-256-GCM encryption**
- 🧬 **Scrypt key derivation**
- 🖼️ **RGB LSB steganography**
- 📦 **Arbitrary file payloads**
- 📊 **Live carrier capacity calculation**
- 🔎 **Authenticated extraction and integrity validation**
- ⌨️ **Hidden command terminal**
- 🎞️ **GSAP-powered state transitions**
- 🌊 **Lenis smooth interactions**
- 🔊 **Custom Web Audio API effects**
- 📱 **Responsive interface**

## How It Works

```text
Secret File
    │
    ▼
Scrypt Key Derivation
    │
    ▼
AES-256-GCM Encryption
    │
    ▼
Encrypted Payload
    │
    ▼
RGB LSB Embedding
    │
    ▼
VEIL PNG
```

During extraction, VEIL reverses the process, validates the embedded payload, authenticates the ciphertext, and reconstructs the original file.

## Cryptography

VEIL uses:

| Component | Implementation |
|---|---|
| Encryption | AES-256-GCM |
| Key Derivation | Scrypt |
| Salt | Random 16-byte salt |
| Nonce | Random 12-byte nonce |
| Authentication | GCM authentication tag |
| Steganography | RGB LSB |
| Integrity | Authenticated encryption + payload validation |

Passwords are never stored by VEIL.

Each encrypted payload receives its own random salt and nonce.

## Steganography

VEIL embeds encrypted payload data into the least significant bits of RGB pixel channels.

The carrier's capacity is determined by its dimensions:

```text
Capacity = width × height × 3 / 8 bytes
```

Before embedding, VEIL checks whether the encrypted payload fits inside the selected carrier.

The resulting image remains a valid PNG while carrying the encrypted payload.

## Command Terminal

VEIL contains a hidden command terminal for interface controls and small utilities.

**Shortcut**

```text
Ctrl + Shift + K
```

On macOS:

```text
Cmd + Shift + K
```

Available commands include:

| Command | Description |
|---|---|
| `genpass [length]` | Generates a cryptographically secure random password |
| `show time` | Displays local and UTC time information |
| `veil` | Displays VEIL system information |
| `status` | Displays engine status |
| `cat` | Displays the VEIL mascot |
| `clear` | Clears terminal output |
| `exit` | Closes the terminal |

## Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-2026?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-2026?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-2026?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-2026?style=flat-square&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-2026?style=flat-square&logo=greensock&logoColor=white)
![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-black?style=flat-square)

### Backend

![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=flat-square&logo=fastapi&logoColor=white)
![Cryptography](https://img.shields.io/badge/Cryptography-AES--256--GCM-black?style=flat-square)

### Deployment

![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=black)

## Architecture

```text
┌─────────────────────┐
│   React / Vite UI   │
└──────────┬──────────┘
           │ HTTPS
           ▼
┌─────────────────────┐
│    FastAPI Backend  │
│       Render        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     VEIL Core       │
├─────────────────────┤
│ Scrypt              │
│ AES-256-GCM         │
│ File Packaging      │
│ Capacity Validation │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│        U92          │
│     RGB LSB         │
│    Steganography    │
└─────────────────────┘
```

## Local Development

### Requirements

- Node.js 18+
- Python 3.13+
- npm

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

### Frontend

```bash
npm install
npm run dev
```

Create an environment variable pointing to the backend:

```env
VITE_API_URL=http://localhost:8000
```

## API

### Health

```http
GET /health
```

### Hide

```http
POST /hide
```

Accepts:

- `file`
- `carrier`
- `password`

Returns the generated VEIL PNG.

### Extract

```http
POST /extract
```

Accepts:

- `image`
- `password`

Returns the recovered file.

Incorrect passwords and corrupted VEIL payloads are reported as explicit API errors rather than connection failures.

## Project Structure

```text
VEIL/
├── backend/
│   ├── main.py
│   └── u92.py
├── veil_core.py
├── u92.py
├── requirements.txt
└── README.md
```

## Security Notes

VEIL is designed so that the secret file is encrypted before it is embedded into the carrier image.

The carrier image itself does not provide the security boundary. The encrypted payload and authenticated encryption are responsible for protecting the secret data.

Do not reuse passwords for sensitive material.

VEIL should not be treated as a substitute for a professionally audited cryptographic system.

## License

MIT License.

See [`LICENSE`](LICENSE) for details.
