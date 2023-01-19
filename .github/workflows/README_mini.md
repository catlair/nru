# npm registry utility

A mini version of nrm for quickly switching npm registry.

一个 mini 版本的 nrm，用于快速切换 npm 的 registry。

## Installation 安装

```bash
npm install -g nru
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
