# 使用示例

## 方式 1：作为模块导入

```typescript
// 导入生成的 TypeScript 文件
import { BaseClient, Domain } from './dist/lark-lite-bun-typed';
import type { BaseClientOptions } from './dist/lark-lite-bun-typed';

// 创建客户端
const client = new BaseClient({
  domain: Domain.Feishu,
  appToken: 'your-app-token',
  personalBaseToken: 'your-personal-token'
});

// 使用客户端
const result = await client.request({
  method: 'GET',
  url: '/bitable/v1/apps/{app_token}',
  path: { app_token: 'your-app-token' }
});
```

## 方式 2：直接复制到项目中

将 `dist/lark-lite-bun-typed.ts` 文件复制到你的项目中，然后直接使用其中的类和函数。

```typescript
// 假设你将文件复制为 src/lark-lite.ts
import { BaseClient, Domain } from './lark-lite';

const client = new BaseClient({
  domain: Domain.Feishu,
  appToken: 'your-app-token',
  personalBaseToken: 'your-personal-token'
});
```

## 文件说明

- `lark-lite-bun-typed.ts` - 适用于 Bun 运行时的完整 TypeScript 源码
- `lark-lite-web-typed.ts` - 适用于浏览器环境的完整 TypeScript 源码
- `lark-lite-node-typed.ts` - 适用于 Node.js 运行时的完整 TypeScript 源码

所有文件都：
- ✅ 保留完整的类型注解
- ✅ 包含所有实现代码
- ✅ 可以直接导入使用
- ✅ 包含 `@ts-nocheck` 注释（避免重复定义警告）
- ✅ 导出主要的类型和类

## 注意事项

生成的文件包含 `@ts-nocheck` 注释，这是因为合并多个文件时可能会有一些重复的辅助函数定义。这不影响实际使用，只是跳过了 TypeScript 的类型检查。

如果你需要完整的类型检查，建议使用标准的 `npm run build` 生成的 `.js` + `.d.ts` 文件组合。
