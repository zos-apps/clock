# 🕐 Clock

> World clock with multiple timezones

Part of the [zOS Apps](https://github.com/zos-apps) ecosystem.

## Installation

```bash
npm install github:zos-apps/clock
```

## Usage

```tsx
import App from '@zos-apps/clock';

function MyApp() {
  return <App />;
}
```

## Package Spec

App metadata is defined in `package.json` under the `zos` field:

```json
{
  "zos": {
    "id": "ai.hanzo.clock",
    "name": "Clock",
    "icon": "🕐",
    "category": "utilities",
    "permissions": [],
    "installable": true
  }
}
```

## Version

v4.2.0

## License

MIT © Hanzo AI
