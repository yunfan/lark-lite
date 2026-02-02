# 使用文档

本项目提供基于 Web 标准 `fetch` 的多维表格 SDK，支持浏览器、Bun、Node.js 三种环境。

## 构建输出

分别执行以下脚本生成对应环境的单文件产物：

```shell
npm run build:bun
npm run build:web
npm run build:node
```

输出文件：
- `dist/lark-lite-bun.ts`
- `dist/lark-lite-web.ts`
- `dist/lark-lite-node.ts`

## 选择域名

Base API 可选域名：
- `https://base-api.feishu.cn`
- `https://base-api.larksuite.com`

所有接口路径在基础域名之后统一带有 `/open-apis` 前缀（SDK 已自动拼接）。

## 初始化

```ts
import { BaseClient, Domain } from './dist/lark-lite-node.ts';

const client = new BaseClient({
  appToken: 'xxx',
  personalBaseToken: 'xxx',
  domain: Domain.Lark
});
```

## 基础调用

```ts
const res = await client.base.appTableRecord.list({
  path: { table_id: 'tblxxxx' },
  params: { page_size: 10 }
});
```

## 分页迭代器

```ts
for await (const data of await client.base.appTableRecord.listWithIterator({
  path: { table_id: 'tblxxxx' },
  params: { page_size: 20 }
})) {
  console.log(data.items);
}
```

## 上传附件

```ts
const uploaded = await client.drive.media.uploadAll({
  data: {
    file_name: 'file.png',
    parent_type: 'bitable_image',
    parent_node: client.appToken,
    size: fileSize,
    file: fileBlob
  }
});
```

## 下载附件

```ts
const response = await client.drive.media.download({
  path: { file_token: 'xxx' }
});

// Node 环境可用
await response.writeFile('/tmp/file.png');
```

## 三个环境的引用示例

Bun
```ts
import { BaseClient } from './dist/lark-lite-bun.ts';
const client = new BaseClient({ appToken: 'xxx', personalBaseToken: 'xxx' });
```

Web
```ts
import { BaseClient } from './dist/lark-lite-web.ts';
const client = new BaseClient({ appToken: 'xxx', personalBaseToken: 'xxx' });
```

Node
```ts
import { BaseClient } from './dist/lark-lite-node.ts';
const client = new BaseClient({ appToken: 'xxx', personalBaseToken: 'xxx' });
```

## 可配置项

```ts
const client = new BaseClient({
  appToken: 'xxx',
  personalBaseToken: 'xxx',
  domain: Domain.Lark,
  apiPrefix: '/open-apis',
  userAgent: 'base-open-sdk-node/v1.0.0'
});
```

## API 列表（按分组）

以下为 apidoc 中已实现的接口归类与调用形式，便于快速检索。

### base.app
- `client.base.app.copy()`
- `client.base.app.create()`
- `client.base.app.get()`
- `client.base.app.update()`

### base.appDashboard
- `client.base.appDashboard.copy()`
- `client.base.appDashboard.list()`
- `client.base.appDashboard.listWithIterator()`

### base.appRole
- `client.base.appRole.create()`
- `client.base.appRole.delete()`
- `client.base.appRole.list()`
- `client.base.appRole.listWithIterator()`
- `client.base.appRole.update()`

### base.appRoleMember
- `client.base.appRoleMember.batchCreate()`
- `client.base.appRoleMember.batchDelete()`
- `client.base.appRoleMember.create()`
- `client.base.appRoleMember.delete()`
- `client.base.appRoleMember.list()`
- `client.base.appRoleMember.listWithIterator()`

### base.appTable
- `client.base.appTable.batchCreate()`
- `client.base.appTable.batchDelete()`
- `client.base.appTable.create()`
- `client.base.appTable.delete()`
- `client.base.appTable.list()`
- `client.base.appTable.listWithIterator()`
- `client.base.appTable.patch()`

### base.appTableField
- `client.base.appTableField.create()`
- `client.base.appTableField.delete()`
- `client.base.appTableField.list()`
- `client.base.appTableField.listWithIterator()`
- `client.base.appTableField.update()`

### base.appTableForm
- `client.base.appTableForm.get()`
- `client.base.appTableForm.patch()`

### base.appTableFormField
- `client.base.appTableFormField.list()`
- `client.base.appTableFormField.listWithIterator()`
- `client.base.appTableFormField.patch()`

### base.appTableRecord
- `client.base.appTableRecord.batchCreate()`
- `client.base.appTableRecord.batchDelete()`
- `client.base.appTableRecord.batchUpdate()`
- `client.base.appTableRecord.create()`
- `client.base.appTableRecord.delete()`
- `client.base.appTableRecord.get()`
- `client.base.appTableRecord.list()`
- `client.base.appTableRecord.listWithIterator()`
- `client.base.appTableRecord.update()`
- `client.base.appTableRecord.search()`

### base.appTableView
- `client.base.appTableView.create()`
- `client.base.appTableView.delete()`
- `client.base.appTableView.get()`
- `client.base.appTableView.list()`
- `client.base.appTableView.listWithIterator()`
- `client.base.appTableView.patch()`

### drive.media
- `client.drive.media.uploadAll()`
- `client.drive.media.download()`
- `client.drive.media.batchGetTmpDownloadUrl()`

## 常见调用片段

列出数据表
```ts
await client.base.appTable.list({ params: { page_size: 50 } });
```

创建数据表
```ts
await client.base.appTable.create({
  data: { name: 'New Table', fields: [] }
});
```

列出字段
```ts
await client.base.appTableField.list({
  path: { table_id: 'tblxxxx' },
  params: { page_size: 100 }
});
```

新增记录
```ts
await client.base.appTableRecord.create({
  path: { table_id: 'tblxxxx' },
  data: { fields: { Name: 'Alice' } }
});
```

批量更新记录
```ts
await client.base.appTableRecord.batchUpdate({
  path: { table_id: 'tblxxxx' },
  data: { records: [{ record_id: 'recxxx', fields: { Name: 'Bob' } }] }
});
```

搜索记录
```ts
await client.base.appTableRecord.search({
  path: { table_id: 'tblxxxx' },
  data: { filter: { conjunction: 'and', conditions: [] } }
});
```

列出视图
```ts
await client.base.appTableView.list({
  path: { table_id: 'tblxxxx' },
  params: { page_size: 50 }
});
```
