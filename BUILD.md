# 构建脚本说明

本项目提供多种构建脚本，用于生成不同格式和平台的输出文件。

## 标准构建

### `npm run build`
使用 TypeScript 编译器 (tsc) 编译项目，生成：
- `.js` 文件（JavaScript 实现）
- `.d.ts` 文件（类型定义）
- 保持原有目录结构

输出目录：`dist/`

## JavaScript 打包构建（使用 esbuild）

这些脚本生成单文件打包的 JavaScript 代码（扩展名为 .ts 但内容是 JS）：

### `npm run build:bun`
- 平台：Bun/Neutral
- 输出：`dist/lark-lite-bun.ts`
- 特点：适用于 Bun 运行时

### `npm run build:web`
- 平台：Browser
- 输出：`dist/lark-lite-web.ts`
- 特点：适用于浏览器环境

### `npm run build:node`
- 平台：Node.js
- 输出：`dist/lark-lite-node.ts`
- 特点：适用于 Node.js 运行时

## TypeScript 源码打包构建（保留类型）

这些脚本生成单文件打包的 TypeScript 源码，**保留所有类型注解**，并包含导出语句：

### `npm run build:bun:ts`
- 输出：`dist/lark-lite-bun-typed.ts`
- 特点：完整的 TypeScript 源码，包含类型注解和导出
- 用途：可作为模块导入，或直接复制到 TypeScript 项目中使用
- 大小：~31KB

### `npm run build:web:ts`
- 输出：`dist/lark-lite-web-typed.ts`
- 特点：完整的 TypeScript 源码，包含类型注解和导出
- 大小：~31KB

### `npm run build:node:ts`
- 输出：`dist/lark-lite-node-typed.ts`
- 特点：完整的 TypeScript 源码，包含类型注解和导出
- 大小：~31KB

### `npm run build:all:ts`
一次性生成所有平台的 TypeScript 源码打包文件。

**导出内容：**
- `BaseClient` - 主客户端类
- `Domain` - 域名枚举
- `BaseClientOptions` - 客户端配置类型
- `RequestArgs`, `RequestOptions` - 请求相关类型
- `HttpMethod`, `ResponseType` - HTTP 相关类型
- `LoggerLevel`, `Logger` - 日志相关类型

## 文件对比

| 脚本 | 输出文件 | 格式 | 类型注解 | 导出 | 大小 |
|------|---------|------|---------|------|------|
| `build:bun` | `lark-lite-bun.ts` | JavaScript | ❌ | ❌ | ~21KB |
| `build:bun:ts` | `lark-lite-bun-typed.ts` | TypeScript | ✅ | ✅ | ~31KB |

## 使用建议

1. **发布到 npm**：使用 `npm run build` 生成标准的 .js + .d.ts 文件
2. **作为模块导入**：使用 `npm run build:bun:ts` 等生成带类型和导出的单文件，可以直接 import
3. **直接复制使用**：将生成的 `-typed.ts` 文件复制到项目中
4. **浏览器使用**：使用 `npm run build:web` 或 `npm run build:web:ts`

详细使用示例请参考 [USAGE.md](./USAGE.md)。

## 注意事项

- TypeScript 源码打包文件包含 `@ts-nocheck` 注释，因为合并多个文件可能导致重复定义
- 所有构建都会排除 `node:fs/promises` 等外部依赖
- 生成的文件都是 ESM 格式
