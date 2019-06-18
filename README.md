# mock-request-loader
a webpack loader can merge mock data and request api smoothly


# 开始

### 安装loader

```console
$ npm install mock-request-loader --save-dev
```

### 创建*.mock.req.js文件

### 在*.mock.req.js的api方法上添加注解@mock(), 注入mock数据
```js
/**
 * 
 * 查询用户列表
 * @return: {Promise} 包含用户列表的promise
 * 
 */
 @mock({
    code: 1,
    data: {
      list: [{ id: 1, name: 'bibidu' }]
    }
  })
  function getUser() {
    return http.get('/user')
  }

```
### 配置webpack loader并开启mock(req文件使用到某些js特性需通过babel-loader进行后续编译)
```

module: {
  rules: [{
    test: /\.req$/,
    use: [
      { loader: 'babel-loader' },
      {
        loader: "mock-request-loader",
        options: {
          mock: true
        }
      }
    ],
  }]
}
```

# License

#### [MIT](./LICENSE)