# nru -- npm registry utility

[![install size](https://packagephobia.com/badge?p=nru)](https://packagephobia.com/result?p=nru)

> English:
>
> "Introducing nru (npm registry utility) - the efficient registry management tool for npm, yarn and pnpm. Unlike nrm, nru is designed to be a lightweight alternative that allows you to quickly download and switch registries without the need for large downloads. The codebase for nru is primarily derived from our copilot and chatbot (chatgpt), making it an automatically generated or conversational-based tool. Even this introduction was written by our chatbot, chatgpt. Say goodbye to slow download times and hello to efficient registry management with nru."
>
> 中文:
>
> "介绍 nru（npm registry utility）- npm，yarn 和 pnpm 的高效注册表管理工具。与 nrm 不同，nru 旨在成为一种轻量级的替代品，可以在不需要大量下载的情况下快速下载和切换注册表。nru 的代码库主要来自 copilot 和聊天机器人（chatgpt），使其成为一种自动生成或基于对话的工具。甚至这篇介绍也是我们的聊天机器人 chatgpt 写的。告别缓慢的下载时间，欢迎使用 nru 高效的注册表管理。"

- nru 不支持删除或修改其内置仓库。
- 就像屎一样的代码，我不知道为啥 chatgpt 会说它 “高效”。
- 与 nrm 不一致的是 login/pub 默认是 npm 而不是当前，因为考虑到如果你需要登录当前的 registry，直接用 npm 即可。
- shit yarn2, fuck you

## Installation

```bash
npm install -g nru
```

## Usage

```bash
Usage: nru [command] [args]

Commands:
  current, cur                    :Show current manager and registry
  list, ls                        :List all registries
  use, u [name]                   :Use registry by name, if no name provided, use npm registry
  test [name]                     :Test registry by name, if no name provided, test all registries
  add <name> <registry> [home]    :Add registry
  del, rm <name> [name2] ...      :Delete registry
  rename, ren <old> <new>         :Rename registry
  home <name>                     :Open registry home page in browser
  def <N|Y> [name]                :Define current manager as N(npm) or Y(yarn), if name provided, use it
  login, lg <name> [args]         :Login registry, args will be passed to npm login
  publish, pub <name> [args]      :Publish package to registry, args will be passed to npm publish
  unpublish, unpub <name> [args]  :Unpublish package from registry, args will be passed to npm unpublish
  set <name> <key> <value>        :Set registry config
  set-scope <scope> <name>        :Set scope registry
  del-scope <scope>               :Delete scope registry
  help                            :Show help
```

## Example

```bash
nru list

nru use taobao

nru use npm

nru add local http://localhost:4873

nru del local

nru def Y taobao
```
