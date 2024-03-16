# nru -- npm registry utility

[![install size](https://packagephobia.com/badge?p=nru)](https://packagephobia.com/result?p=nru)

- 足够小，才能在需要切换 registry 时快速下载，而不是先 Baidu/Google/Bing 修改一下 registry，然后再 npm install。
- 作者是 OpenAI ChatGPT，Github Copilot 以及我，没错这就是 “人工智能“ 。
- nru 不支持删除或修改其内置仓库，这和 nrm 一致。
- 就像屎一样的代码，我不知道为啥 chatgpt 会说它 “高效”。
- 与 nrm 不一致的是 login/pub 默认是 npm 而不是当前，因为考虑到如果你需要登录当前的 registry，直接用 npm 即可。
- 能够为 yarn2 设置镜像，but shit yarn2, 🌺Q。

## Installation

You need to install nodejs first, then execute the following command:
你需要先安装 nodejs，然后执行以下命令：

```bash
npm install -g nru
```

## Example

```bash
❯ nru use taobao
  Set registry to  https://registry.npmmirror.com/
```

```bash
❯ nru cur
  Current manager: y
  Current registry: https://registry.npmmirror.com/
```

```bash
❯ nru ls

* n # current manager is npm
    npm -------- https://registry.npmjs.org/
    yarn ------- https://registry.yarnpkg.com/
  Y taobao ----- https://registry.npmmirror.com/ # yarn registry
    huawei ----- https://repo.huaweicloud.com/repository/npm/
    tencent ---- https://mirrors.cloud.tencent.com/npm/
    npmMirror -- https://skimdb.npmjs.com/registry/
    ustc ------- https://npmreg.proxy.ustclug.org/
 NP ali -------- https://packages.aliyun.com/npm/npm-registry/ # npm registry
    github ----- https://npm.pkg.github.com/
```

```bash
# Define current manager as npm, and set npm registry to taobao
# 定义当前管理器为 npm，并把 npm 的 registry 设置为 taobao

❯ nru def n taobao
  Current manager defined as n
  Set registry to  https://registry.npmmirror.com/
```

## Usage

```bash
Usage: nru [command] [args]

Commands:
  current, cur                    :显示当前管理器和注册表
  list, ls                        :列出所有注册表
  use, u [name]                   :使用注册表，如果没有提供名称，则使用 npm 注册表
  test [name]                     :测试注册表，如果没有提供名称，则测试所有注册表
  add <name> <registry> [home]    :添加自定义注册表，home 提供者的主页
  del, rm <name> [name2] ...      :删除自定义注册表
  rename, ren <old> <new>         :重命名自定义注册表
  home <name>                     :在浏览器中打开注册表主页
  def <N|Y> [name]                :将当前管理器定义为 N(npm)、Y(yarn)，如果提供了名称，则使用它（调用 use 命令）
  login, lg [name>] [args]        :登录为 name 的注册表，参数将传递给 npm login，如果没有提供名称，则使用 npm
  publish, pub [name>] [args]     :将包发布到为 name 的注册表，参数将传递给 npm publish，如果没有提供名称，则使用 npm
  unpublish, unpub [name>] [args] :从注册表中取消发布包，参数将传递给 npm unpublish，如果没有提供名称，则使用 npm
  set <name> <key> <value>        :设置注册表配置
  set-scope <scope> <name>        :设置作用域注册表
  del-scope <scope>               :删除作用域注册表
  help                            :显示帮助
```

注：注册表也就是镜像链接。

```bash
Usage: nru [command] [args]

Commands:
  current, cur                    :Show current manager and registry
  list, ls                        :List all registries
  use, u [name]                   :Use registry by name, if no name provided, use npm registry
  test [name]                     :Test registry by name, if no name provided, test all registries
  add <name> <registry> [home]    :Add registry, home is the home page of provider
  del, rm <name> [name2] ...      :Delete registry
  rename, ren <old> <new>         :Rename registry
  home <name>                     :Open registry home page in browser
  def <N|Y> [name]                :Define current manager as N(npm) or Y(yarn) or P(pnpm), if name provided, use it
  login, lg [name>] [args]         :Login registry, args will be passed to npm login，if no name provided, use npm
  publish, pub [name>] [args]      :Publish package to registry
  unpublish, unpub [name>] [args]  :Unpublish package from registry
  set <name> <key> <value>        :Set registry config
  set-scope <scope> <name>        :Set scope registry
  del-scope <scope>               :Delete scope registry
  help                            :Show help
```

## Registries

- [npm](https://www.npmjs.com/)
- [yarn](https://yarnpkg.com/)
- [taobao](https://npmmirror.com/)
- [huawei](https://mirrors.huaweicloud.com/home)
- [tencent](https://mirrors.cloud.tencent.com/help/npm.html)
- [npmMirror](https://skimdb.npmjs.com/)
- [github](https://npm.pkg.github.com/)
- [ustc](https://mirrors.ustc.edu.cn/help/npm.html)
- [cnpm](https://cnpmjs.org/)
- [cernet](https://help.mirrors.cernet.edu.cn/npm)

## Related Projects

- [nrm -- NPM registry manager](https://github.com/Pana/nrm)

## Todo

- Add tests for some commands

## License

MIT
