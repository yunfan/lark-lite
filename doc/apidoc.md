# BaseOpenSDK（Node.js）官方文档

**重要提示（域名）**：本 SDK 请求的基础域名是 Base API 域，不是 OpenAPI 域。  
可选域名为：
- `https://base-api.feishu.cn`
- `https://base-api.larksuite.com`
  
**重要提示（前缀）**：所有接口路径在基础域名之后统一带有 `/open-apis` 前缀（由 SDK 统一拼接）。  

## 概述

飞书开放平台提供了一系列服务端的原子 API 来实现多元化的功能，其中就包括操作多维表格的数据。但是这一套流程需要申请开放平台应用，使用开放平台的鉴权体系，对于只想通过服务端脚本快速操作多维表格的开发者，流程未免显得繁琐。为此，我们新推出了多维表格独立的鉴权体系，开发者可以在网页端获取某个 Base 的授权码 PersonalBaseToken，即可在服务端通过 SDK 操作 Base 数据。

BaseOpenSDK 接口定义和飞书开放平台 OpenAPI 完全一致，无需额外的学习成本。我们将所有冗长的逻辑内置处理，提供完备的类型系统、语义化的编程接口，提高开发者的编码体验。

## 概念

| 术语 | 解释 |
|------|------|
| Base | 多维表格文档 |
| AppToken（又称 BaseId）| Base 文档的唯一标识，可从 Base URL 路径参数 `/base/:app_token` 快速获得；但如果是 `/wiki/` 路径，则不能便捷获得。建议直接通过【开发工具】插件快速获取当前 Base 的 AppToken |
| PersonalBaseToken | Base 文档授权码。用户针对某个 Base 文档生成的鉴权凭证，使用凭证访问相应的接口可对 Base 数据进行读写。**注：使用 PersonalBaseToken 访问 OpenAPI 单文档限频 2qps，多文档支持并发。** |

## 安装

### npm
```shell
npm i -S @lark-base-open/node-sdk
```

### yarn
```shell
yarn add @lark-base-open/node-sdk
```

## 如何使用

提供 ECMAScript，CommonJS 2个版本，支持原生 Javascript 和 Typescript 的使用，示例均以 Typescript 为例。

### ECMAScript
```typescript
import { BaseClient } from '@lark-base-open/node-sdk';
```

### CommonJS
```typescript
const { BaseClient } = require('@lark-base-open/node-sdk');
```

## API 调用

SDK 提供了语义化的调用方式，只需要提供相关参数创建 client 实例，接着使用其上的语义化方法 `client.[业务域].[资源].[方法]` 即可完成 API 调用，调用过程及调用结果均有完备的类型进行提示。

### 示例：列出 Base 数据表记录

```typescript
import { BaseClient } from '@lark-base-open/node-sdk';

// 新建 BaseClient，填上需要操作的 Base 文档对应的 appToken 和 personalBaseToken
const client = new BaseClient({
  appToken: 'xxx',
  personalBaseToken: 'xxx'
});

// 列出数据表记录
const res = await client.base.appTableRecord.list({
  // 路径参数。我们会自动为你填充 app_token（appToken）参数，你无需手动添加
  path: {
    table_id: 'tblxxxxxx'
  },
  // 查询参数
  params: {
    page_size: 10,
  },
});
```

### 接口对应的 Http 参数说明

| 接口参数名 | 描述 |
|-----------|------|
| path | Http 请求路径参数 |
| params | Http 请求查询参数 |
| data | Http 请求体 |

### BaseClient 构造参数

| 参数 | 描述 | 类型 | 必须 | 默认 |
|------|------|------|------|------|
| appToken | Base 文档的唯一标识，从 Base 网页的路径参数获取 `/base/:app_token` | string | 是 | - |
| personalBaseToken | Base 文档授权码。从 Base 网页端获取 | string | 是 | - |
| domain | 应用的域，分为飞书、Lark | Domain | 否 | Domain.Feishu |
| httpInstance | SDK 发送请求的 http 实例。SDK 内部默认使用 `axios.create()` 构造出一个 defaultHttpInstance 来进行 http 调用 | HttpInstance | 否 | defaultHttpInstance |
| loggerLevel | 日志级别 | LoggerLevel | 否 | info |
| logger | - | Logger | 否 | - |

## 分页

针对返回值以分页形式呈现的接口，对其提供了迭代器方式的封装（方法名后缀为 `WithIterator`），提高易用性，消弭了根据 page_token 来反复获取数据的繁琐操作。

### 示例：获取数据表记录列表

```typescript
// 每次处理20条数据
for await (const data of await client.base.appTableRecord.listWithIterator({
  params: {
    page_size: 20,
  },
  path: {
    table_id: TABLEID
  }
})) {
  console.log(data.items);
}
```

当然也可以使用无迭代器封装的版本，这时候需要自己每次根据返回的 page_token 来手动进行分页调用。

## 附件上传

和调用普通 API 的方式一样，按类型提示传递参数即可，内部封装了对文件上传的处理。

```typescript
const filePath = path.resolve(__dirname, 'file.jpeg')

const data = await client.drive.media.uploadAll({
  data: {
    file_name: 'file.png', // 文件名
    parent_type: 'bitable_image', // 附件为图片传 'bitable_image'，为文件传 'bitable_file'
    parent_node: client.appToken, // 填写 appToken
    size: fs.statSync(filePath).size, // 文件大小
    file: fs.createReadStream(filePath), // 文件流
  }
})
const fileToken = data.file_token;
```

### 上传附件后添加到新建记录的附件字段

```typescript
await client.base.appTableRecord.create({
  path: {
    table_id: TABLEID
  },
  data: {
    fields: {
      ['附件']: [{
        "file_token": fileToken // 前面接口返回的 fileToken
      }]
    }
  }
})
```

## 附件下载

对返回的二进制流进行了封装，消弭了对流本身的处理，只需调用 `writeFile` 方法即可将数据写入文件。

```typescript
const response = await client.drive.media.download({
  path: { file_token: 'xxx' },
  // 如果 Base 开启了高级权限，则需要填写 extra 参数，否则不用传。
  params: { extra: JSON.stringify({
    "bitablePerm": {
      "tableId": 'tblxxx', // 附件所在数据表Id
      "attachments": {
        "fldxxxxxxx": { // 附件字段 Id
            "recxxxxxxx": [ // 附件所在记录Id
              "xxx" // 附件 file_token
            ]
        }
      }
    }
  }) }
})
// 保存到本地 file.png 文件
await response.writeFile(path.resolve(__dirname, 'file.png'));
```

## 普通调用

可以使用 client 上的 request 方法手动调用业务接口，我们同样帮你处理好了鉴权逻辑：

```typescript
import { BaseClient } from '@lark-base-open/node-sdk';

const client = new BaseClient({
  appToken: 'xxx',
  personalBaseToken: 'xxx'
});

// request 接口
const res = await client.request({
  method: 'POST',
  url: 'xxx',
  data: {},
  params: {},
});
```

---

# 接口范围列表

## base（多维表格）

### app（多维表格）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| copy | 拷贝多维表格 | `POST /bitable/v1/apps/{app_token}/copy` | `client.base.app.copy()` |
| create | 创建多维表格 | `POST /bitable/v1/apps` | `client.base.app.create()` |
| get | 获取多维表格元数据 | `GET /bitable/v1/apps/{app_token}` | `client.base.app.get()` |
| update | 更新多维表格元数据 | `PUT /bitable/v1/apps/{app_token}` | `client.base.app.update()` |

**官方文档：**
- [Create a Base App](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/create)
- [Get App Info](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app/get)
- [Update App Name](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app/update)

---

### appDashboard（仪表盘）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| copy | 拷贝仪表盘 | `POST /bitable/v1/apps/{app_token}/dashboards/{block_id}/copy` | `client.base.appDashboard.copy()` |
| list | 列出仪表盘 | `GET /bitable/v1/apps/{app_token}/dashboards` | `client.base.appDashboard.list()` |

**API 详情：**

#### 列出仪表盘 (list)
- **端点**: `GET https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/dashboards`
- **频率限制**: 20 QPS
- **响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "dashboards": [
      {
        "block_id": "blknkqrP3RqUkcAW",
        "name": "仪表盘1"
      }
    ],
    "page_token": "blknkqrP3RqUkcAW",
    "has_more": false
  }
}
```

---

### appRole（自定义角色）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| create | 新增自定义角色 | `POST /bitable/v1/apps/{app_token}/roles` | `client.base.appRole.create()` |
| delete | 删除自定义角色 | `DELETE /bitable/v1/apps/{app_token}/roles/{role_id}` | `client.base.appRole.delete()` |
| list | 列出自定义角色 | `GET /bitable/v1/apps/{app_token}/roles` | `client.base.appRole.list()` |
| update | 更新自定义角色 | `PUT /bitable/v1/apps/{app_token}/roles/{role_id}` | `client.base.appRole.update()` |

---

### appRoleMember（协作者）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| batchCreate | 批量新增协作者 | `POST /bitable/v1/apps/{app_token}/roles/{role_id}/members/batch_create` | `client.base.appRoleMember.batchCreate()` |
| batchDelete | 批量删除协作者 | `POST /bitable/v1/apps/{app_token}/roles/{role_id}/members/batch_delete` | `client.base.appRoleMember.batchDelete()` |
| create | 新增协作者 | `POST /bitable/v1/apps/{app_token}/roles/{role_id}/members` | `client.base.appRoleMember.create()` |
| delete | 删除协作者 | `DELETE /bitable/v1/apps/{app_token}/roles/{role_id}/members/{member_id}` | `client.base.appRoleMember.delete()` |
| list | 列出协作者 | `GET /bitable/v1/apps/{app_token}/roles/{role_id}/members` | `client.base.appRoleMember.list()` |

---

### appTable（数据表）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| batchCreate | 批量创建数据表 | `POST /bitable/v1/apps/{app_token}/tables/batch_create` | `client.base.appTable.batchCreate()` |
| batchDelete | 批量删除数据表 | `POST /bitable/v1/apps/{app_token}/tables/batch_delete` | `client.base.appTable.batchDelete()` |
| create | 新增数据表 | `POST /bitable/v1/apps/{app_token}/tables` | `client.base.appTable.create()` |
| delete | 删除数据表 | `DELETE /bitable/v1/apps/{app_token}/tables/{table_id}` | `client.base.appTable.delete()` |
| list | 列出数据表 | `GET /bitable/v1/apps/{app_token}/tables` | `client.base.appTable.list()` |
| patch | 更新数据表 | `PATCH /bitable/v1/apps/{app_token}/tables/{table_id}` | `client.base.appTable.patch()` |

**官方文档：**
- [Create table](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/create)
- [List all tables](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table/list)
- [Batch create table](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table/batch_create)
- [Update data table](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/patch)

---

### appTableField（字段）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| create | 新增字段 | `POST /bitable/v1/apps/{app_token}/tables/{table_id}/fields` | `client.base.appTableField.create()` |
| delete | 删除字段 | `DELETE /bitable/v1/apps/{app_token}/tables/{table_id}/fields/{field_id}` | `client.base.appTableField.delete()` |
| list | 列出字段 | `GET /bitable/v1/apps/{app_token}/tables/{table_id}/fields` | `client.base.appTableField.list()` |
| update | 更新字段 | `PUT /bitable/v1/apps/{app_token}/tables/{table_id}/fields/{field_id}` | `client.base.appTableField.update()` |

**官方文档：**
- [List fields](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/list)
- [Field edit development guide](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/guide)

---

### appTableFormField（表单项）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| list | 列出表单项 | `GET /bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}/fields` | `client.base.appTableFormField.list()` |
| patch | 更新表单项 | `PATCH /bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}/fields/{field_id}` | `client.base.appTableFormField.patch()` |

---

### appTableForm（表单）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| get | 获取表单 | `GET /bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}` | `client.base.appTableForm.get()` |
| patch | 更新表单元数据 | `PATCH /bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}` | `client.base.appTableForm.patch()` |

**API 详情：**

#### 更新表单元数据 (patch)
- **端点**: `PATCH https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}`
- **请求体参数**:
  - `name`: 表单名称
  - `description`: 表单描述
  - `shared`: 是否共享
  - `shared_limit`: 共享限制
  - `submit_limit_once`: 是否限制单次提交

**官方文档：**
- [Patch form](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-form/patch)

---

### appTableRecord（记录）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| batchCreate | 批量新增记录 | `POST /bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_create` | `client.base.appTableRecord.batchCreate()` |
| batchDelete | 批量删除记录 | `POST /bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_delete` | `client.base.appTableRecord.batchDelete()` |
| batchUpdate | 批量更新记录 | `POST /bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_update` | `client.base.appTableRecord.batchUpdate()` |
| create | 新增记录 | `POST /bitable/v1/apps/{app_token}/tables/{table_id}/records` | `client.base.appTableRecord.create()` |
| delete | 删除记录 | `DELETE /bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}` | `client.base.appTableRecord.delete()` |
| get | 获取记录 | `GET /bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}` | `client.base.appTableRecord.get()` |
| list | 列出记录 | `GET /bitable/v1/apps/{app_token}/tables/{table_id}/records` | `client.base.appTableRecord.list()` |
| update | 更新记录 | `PUT /bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}` | `client.base.appTableRecord.update()` |

**API 详情：**

#### 批量更新记录 (batchUpdate)
- **端点**: `POST https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_update`
- **频率限制**: 10 QPS
- **单次限制**: 最多 500 条记录
- **请求体**:
```json
{
  "records": [
    {
      "record_id": "recxxxxxx",
      "fields": {
        "字段名": "值"
      }
    }
  ]
}
```

**官方文档：**
- [Create a record](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create)
- [List records](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/list)
- [Update a record](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/update)
- [Update records (batch)](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/batch_update)
- [Search records](https://open.feishu.cn/document/docs/bitable-v1/app-table-record/search)

**注意事项：**
- 多维表格新增记录最容易出错的位置是：字段名称、字段内容的类型不匹配
- 比如表格中「发布内容」是日期类型，但是传入的是字符，就一定会出错
- 单次批量新增最多支持 1000 条

---

### appTableView（视图）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| create | 新增视图 | `POST /bitable/v1/apps/{app_token}/tables/{table_id}/views` | `client.base.appTableView.create()` |
| delete | 删除视图 | `DELETE /bitable/v1/apps/{app_token}/tables/{table_id}/views/{view_id}` | `client.base.appTableView.delete()` |
| get | 获取视图 | `GET /bitable/v1/apps/{app_token}/tables/{table_id}/views/{view_id}` | `client.base.appTableView.get()` |
| list | 列出视图 | `GET /bitable/v1/apps/{app_token}/tables/{table_id}/views` | `client.base.appTableView.list()` |
| patch | 更新视图 | `PATCH /bitable/v1/apps/{app_token}/tables/{table_id}/views/{view_id}` | `client.base.appTableView.patch()` |

**官方文档：**
- [Get View](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-view/get)
- [Delete View](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-view/delete)

---

## drive（云文档-文件管理）

### media（素材）

| 方法 | 说明 | API 端点 | 调用示例 |
|------|------|----------|----------|
| download | 下载素材 | `GET /drive/v1/medias/{file_token}/download` | `client.drive.media.download()` |
| uploadAll | 上传素材 | `POST /drive/v1/medias/upload_all` | `client.drive.media.uploadAll()` |

**API 详情：**

#### 上传素材 (uploadAll)
- **端点**: `POST https://open.feishu.cn/open-apis/drive/v1/medias/upload_all`
- **Content-Type**: `multipart/form-data`
- **请求参数**:
  - `file`: 要上传的文件
  - `file_name`: 文件名，如 "test.txt"
  - `parent_type`: 父类型
    - `bitable_image`: 附件为图片
    - `bitable_file`: 附件为文件
  - `parent_node`: 父节点（appToken）
  - `size`: 文件大小（字节）

- **响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "file_token": "boxcnrHpsg1QDqXAAAyachabcef"
  }
}
```

- **注意**: 请不要使用这个接口上传大于 20MB 的文件，如果有这个需求可以尝试使用分片上传接口。

#### 获取素材临时下载链接
- **端点**: `GET https://open.feishu.cn/open-apis/drive/v1/medias/batch_get_tmp_download_url`
- **Query 参数**: `file_tokens`
- **频率限制**: 5 QPS
- **响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "tmp_download_urls": [
      {
        "file_token": "boxcnabcdefg",
        "tmp_download_url": "https://..."
      }
    ]
  }
}
```
- **注意**: 链接时效性是 24 小时，过期失效

**官方文档：**
- [Upload media](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/drive-v1/media/upload_all)

---

# 示例代码

## 一、批量查找替换多行文本

```typescript
import { BaseClient } from '@lark-base-open/node-sdk';

// 新建 BaseClient，填写需要操作的 appToken 和 personalBaseToken
const client = new BaseClient({
  appToken: 'xxx',
  personalBaseToken: 'xxx'
});

const TABLEID = 'xxx';

interface IRecord {
  record_id: string;
  fields: Record<string, any>
}

// 查找替换
async function searchAndReplace(from: string, to: string) {
  // 获取当前表的字段信息
  const res = await client.base.appTableField.list({
    params: {
      page_size: 100,
    },
    path: {
      table_id: TABLEID,
    }
  });
  const fields = res?.data?.items || [];
  // 文本列
  const textFieldNames = fields.filter(field => field.ui_type === 'Text').map(field => field.field_name);

  // 遍历记录
  for await (const data of await client.base.appTableRecord.listWithIterator({ params: { page_size: 50 }, path: { table_id: TABLEID } })) {
    const records = data?.items || [];
    const newRecords: IRecord[] = [];
    for (const record of records) {
      const { record_id, fields } = record || {};
      const entries = Object.entries<string>(fields);
      const newFields: Record<string, string> = {};
      for (const [key, value] of entries) {
        // 替换多行文本字段值
        if ((textFieldNames.includes(key)) && value) {
          const newValue = value.replace(new RegExp(from, 'g'), to);
          // 把需要替换的字段加入 newFields
          newValue !== value && (newFields[key] = newValue);
        }
      }
      // 需要替换的记录加入 newRecords
      Object.keys(newFields).length && newRecords.push({
        record_id,
        fields: newFields,
      })
    }

    // 批量更新记录
    await client.base.appTableRecord.batchUpdate({
      path: {
        table_id: TABLEID,
      },
      data: {
        records: newRecords
      }
    })
  }
  console.log('success')
}

searchAndReplace('abc', '23333333');

console.log('start')
```

## 二、将链接字段对应的文件传到附件字段

```typescript
import { BaseClient } from '@lark-base-open/node-sdk';
import axios from 'axios';
import { Readable } from 'stream';
import path from 'path'

// 新建 BaseClient，填入 appToken 和 personalBaseToken
const client = new BaseClient({
  appToken: 'xxx',
  personalBaseToken: 'xxx'
});

const TABLEID = 'xxx';
const LINK_FIELD_NAME = '链接'
const ATTACHMENT_FIELD_NAME = '附件'

async function downloadLinkAndUploadToAttachment() {
  // Step 1. 遍历记录
  const recordsIterator = client.base.appTableRecord.listWithIterator({
    path: { table_id: TABLEID },
    params: { page_size: 50 },
  });
  const updatedRecords = [];
  for await (const recordBatch of await recordsIterator) {
    for (const record of recordBatch.items) {
      // Step 2. 拿到链接字段值
      const imageUrl = record.fields[LINK_FIELD_NAME]?.link;
      if (imageUrl) {
        // Step 3 : 下载图片
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
        // Step 4: 上传图片获取 file_token
        const uploadedImage = await client.drive.media.uploadAll({
          data: {
            file_name: 'image.png',
            parent_type: 'bitable_image',
            parent_node: client.appToken,
            size: imageBuffer.length,
            file: Readable.from(imageBuffer),
          },
        });
        const fileToken = uploadedImage.file_token;
        // Step 5: 更新到对应记录的附件字段
        updatedRecords.push({
          record_id: record.record_id,
          fields: {
            [ATTACHMENT_FIELD_NAME]: [{ file_token: fileToken }],
          },
        });
      }
    }
  }
  // Step 6: 批量更新记录
  const batchUpdateResponse = await client.base.appTableRecord.batchUpdate({
    path: { table_id: TABLEID },
    data: { records: updatedRecords },
  });
}
```

---

# 在 Replit 上使用服务端 SDK

我们提供了一个 Replit 模板，它使用 express.js 框架搭建了一个简单的服务器，监听了指定路径，当我们在 Base 上运行这个脚本，就会触发脚本函数的调用。

```typescript
import express from 'express'
import { searchAndReplace } from './playground/search_and_replace'

const app = express()
const port = 3000

// http trigger
app.get('/search_and_replace', async (req, res) => {
  await searchAndReplace('abc', '23333333');
  res.send('success!!!')
});

app.get('/', async (req, res) => {
  res.send('hello world')
});

app.listen(port, () => {
  // Code.....
  console.log('Listening on port: ' + port)
})
```

上述代码监听 `/search_and_replace` 接口路径，并执行我们的示例一中定义的函数，实现操作 Base 数据。

### 方式一：在 Base Script 使用 Replit 链接触发脚本调用
1. 在 Replit 上 Fork 官方模板
2. 通过 Replit Secret 添加环境变量 `APP_TOKEN`、`PERSONAL_BASE_TOKEN`
3. 点击 Run 起 Replit 服务
4. 拷贝 replit 项目域名 + 接口路径，填入 Base Script，保存后点击运行即可触发服务端脚本

### 方式二：Replit 服务端直接运行脚本
如果你的项目无需手动触发，可以直接在 Replit 控制台运行脚本：
```shell
npx vite-node ./playground/search_and_replace
```

---

# 权限配置

使用 API 需要申请相应权限：

1. **申请应用接口调用权限**：根据需要调用的接口文档中描述的「权限要求」到开发者后台申请应用权限
2. **添加应用为文档协作者**：通过云文档 Web 页面右上方「...」->「...更多」-> 「添加文档应用」入口添加

**常用权限：**
- `bitable:app:readonly` - 只读权限
- `bitable:app` - 读写权限

---

# 认证方式

在 Header 中添加 Authorization 参数，格式为：
```
Authorization: Bearer <token>
```

获取 `tenant_access_token` 的接口：
```
POST https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal
```

---

# 相关资源

- **飞书开放平台官方文档**: https://open.feishu.cn/document
- **多维表格概述**: https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview
- **数据结构概览**: https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-structure
- **多维表格 API 功能常见问题**: https://www.feishu.cn/hc/zh-CN/articles/336307279050
- **飞书 API 文档 (Apifox)**: https://feishu.apifox.cn/
