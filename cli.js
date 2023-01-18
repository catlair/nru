#!/usr/bin/env node

const cp = require('child_process');
const fs = require('fs');
const resolve = require('path').resolve;

const defRegistries = {
  npm: {
    home: 'https://www.npmjs.org',
    registry: 'https://registry.npmjs.org/',
  },
  yarn: {
    home: 'https://yarnpkg.com',
    registry: 'https://registry.yarnpkg.com/',
  },
  taobao: {
    home: 'https://npmmirror.com/',
    registry: 'https://registry.npmmirror.com/',
  },
  huawei: {
    home: 'https://mirrors.huaweicloud.com/home',
    registry: 'https://repo.huaweicloud.com/repository/npm/',
  },
  tencent: {
    home: 'https://mirrors.cloud.tencent.com/help/npm.html',
    registry: 'https://mirrors.cloud.tencent.com/npm/',
  },
  npmMirror: {
    home: 'https://skimdb.npmjs.com/',
    registry: 'https://skimdb.npmjs.com/registry/',
  },
  github: {
    home: 'https://npm.pkg.github.com/',
    registry: 'https://npm.pkg.github.com/',
  },
  ustc: {
    home: 'https://mirrors.ustc.edu.cn/help/npm.html',
    registry: 'https://npmreg.proxy.ustclug.org/',
  },
  cnpm: {
    home: 'https://cnpmjs.org/',
    registry: 'https://r.cnpmjs.org/',
  },
};
const MANAGE = {
  yarn: 'yarn',
  pnpm: 'pnpm',
  npm: 'npm',
  y: 'yarn',
  p: 'pnpm',
  n: 'npm',
};

const args = process.argv.slice(2),
  cmd = args.shift(),
  log = console.log,
  write = fs.writeFileSync,
  read = fs.readFileSync,
  exists = fs.existsSync,
  oKeys = Object.keys,
  registries = getRegistries(),
  nruPath = resolve(__dirname, './nru.json'),
  color = {
    green: '\x1B[32m%s\x1B[0m',
    red: '\x1B[31m%s\x1B[0m',
    yellow: '\x1B[33m%s\x1B[0m',
    mb: '\x1B[34m',
    my: '\x1B[33m',
    end: '\x1B[0m',
  },
  logger = {
    red: function red(msg) {
      log(color.red, msg);
    },
    green: function green(msg) {
      log(color.green, msg);
    },
  };

const exec = (cmd, options) => {
  try {
    return cp.execSync(cmd, options);
  } catch (e) {
    process.env.NRU_ERR && logger.red(e);
  }
};
const spawn = (cmd, args, options) => {
  try {
    return cp.spawnSync(cmd, args, options);
  } catch (e) {
    process.env.NRU_ERR && logger.red(e);
  }
};

/**
 * @type {import('child_process').ExecSyncOptions}
 */
const ioOp = {
  stdio: 'inherit',
};
const PADLEN = Math.max(...oKeys(registries).map((key) => key.length)) + 3;
const NO_REGISTRY = '  No registries';
const NO_NAME = '  No registry named ';

switch (cmd) {
  case 'current':
  case 'cur':
    onCurrent();
    break;

  case 'l':
  case 'ls':
  case 'list':
    onList();
    break;

  case 'use':
  case 'u':
    onUse(args[0]);
    break;

  case 'test':
  case 't':
    onTest(args[0]);
    break;

  case 'add':
  case 'a':
    onAdd(args[0], args[1], args[2]);
    break;

  case 'remove':
  case 'delete':
  case 'rm':
  case 'del':
  case 'd':
    onDel(args);
    break;

  case 'rename':
  case 'ren':
    onRename(args[0], args[1]);
    break;

  case 'home':
    onHome(args[0]);
    break;

  case 'define':
  case 'def':
    onDefine(args[0], args[1]);
    break;

  case 'login':
  case 'lg':
    onLogin(args.shift(), args);
    break;

  case 'publish':
  case 'pub':
    onPublish(args.shift(), args);
    break;

  case 'unpublish':
  case 'unpub':
    onUnpublish(args.shift(), args);
    break;

  case 'set':
    onSet(args[0], args[1], args[0]);
    break;

  case 'set-scope':
  case 'set-s':
    onSetScope(args[0], args[1]);
    break;

  case 'del-scope':
  case 'del-s':
    onDelScope(args[0]);
    break;

  default:
    onHelp();
}

function onList() {
  const manager = getManager();
  const allRegistry = getRegistry();
  const keys = oKeys(registries);
  const mKeys = oKeys(allRegistry);
  let registry;
  let curInList = false;
  logger.green('\n* ' + manager);
  keys.forEach((key) => {
    registry = registries[key].registry;
    let prefix = '';
    let cr;
    mKeys.length > prefix.length &&
      mKeys.forEach((mKey) => {
        if (allRegistry[mKey] === registry) {
          prefix += mKey;

          if (mKey === manager[0]) {
            cr = color.green;
            curInList = true;
          } else {
            !cr && (cr = color.yellow);
          }
        }
      });

    if (cr) {
      log(
        cr,
        getRegistryPrint(
          prefix.padStart(mKeys.length, ' ').toUpperCase() + ' ',
          key,
          registry
        )
      );
      return;
    }

    log(getRegistryPrint('    ', key, registry));
  });

  if (!curInList) {
    log(`\n current registry: ${allRegistry[manager]} not in list`);
  }
}

function onUse(registryArg = 'npm') {
  const registry = registries[registryArg];

  if (!registry) {
    logger.red(NO_NAME + registryArg);
    return;
  }

  const manager = getManager();

  if (setRegistry(registry.registry, manager)) {
    log(
      color.green,
      '  Set registry to',
      color.mb,
      registry.registry,
      color.end
    );
  }
}

function onTest(name) {
  if (name && registries[name]) {
    testRegistry(registries[name].registry, name);
    return;
  }

  const currentRegistry = getCurrentRegistry(getManager());
  let registry,
    curInList = false;
  oKeys(registries).forEach((key) => {
    registry = registries[key].registry;
    if (registry === currentRegistry) {
      curInList = true;
    }
    testRegistry(registry, key);
  });

  if (!curInList) {
    testRegistry(currentRegistry, 'current');
  }
}

function onAdd(name, registry, home) {
  if (defRegistries[name]) {
    logger.red('  Registry named ' + name + ' already exists');
    return;
  }

  const configPath = getConfigPath();

  if (!exists(configPath)) {
    writeConfig({});
    return;
  }

  const config = getCustomRegistries();

  if (config[name]) {
    const readline = require('readline');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      color.my +
        '  Registry named ' +
        name +
        ' already exists, do you want to override it? [y/N] ' +
        color.end,
      (answer) => {
        rl.close();

        if (answer.toLowerCase().startsWith('y')) {
          writeConfig(config);
        } else {
          logger.red('  Aborted');
        }
      }
    );
  } else {
    writeConfig(config);
  }

  function writeConfig(config) {
    config[name] = {
      registry: addEndSlash(registry),
      home,
    };
    write(configPath, iniStringify(config));
    logger.green('  Registry ' + name + ' added');
  }
}

function onDel(names) {
  if (!names || !names.length) {
    logger.red(NO_REGISTRY + ' to delete');
    return;
  }

  const configPath = getConfigPath();
  const config = getCustomRegistries();
  const keys = oKeys(config);

  if (!keys.length) {
    logger.red(NO_REGISTRY);
    return;
  }

  keys.forEach((key) => {
    if (names.includes(key)) {
      delete config[key];
    }
  });
  write(configPath, iniStringify(config));
  logger.green('  Registry ' + names.join(', ') + ' deleted');
}

function onRename(oldName, newName) {
  if (!oldName || !newName) {
    logger.red(NO_REGISTRY + ' to rename');
    return;
  }

  const config = getCustomRegistries();
  const keys = oKeys(config);

  if (!keys.length) {
    logger.red(NO_REGISTRY);
    return;
  }

  if (!config[oldName]) {
    logger.red(NO_NAME + oldName);
    return;
  }

  if (config[newName]) {
    logger.red('  Registry named ' + newName + ' already exists');
    return;
  }

  config[newName] = config[oldName];
  delete config[oldName];
  write(getConfigPath(), iniStringify(config));
  logger.green('  Registry ' + oldName + ' renamed to ' + newName);
}

function onHome(name) {
  if (!registries[name]) {
    logger.red(NO_NAME + name);
    return;
  }

  const home = registries[name].home;

  if (!home) {
    logger.red('  No home for registry ' + name);
    return;
  }

  let open;

  switch (process.platform) {
    case 'darwin':
      open = 'open';
      break;

    case 'win32':
      open = 'start';
      break;

    default:
      open = 'xdg-open';
  }

  log(color.yellow, '  Opening ' + home + ' in browser');
  exec(`${open} ${home}`);
}

function onCurrent() {
  const manager = getManager();
  const registry = getCurrentRegistry(manager);
  log('  Current manager: ' + manager);
  log('  Current registry: ' + registry);
}

function onDefine(manager, registry) {
  manager = manager.toLowerCase();

  if (oKeys(MANAGE).includes(manager)) {
    write(
      nruPath,
      JSON.stringify({
        define: manager,
      })
    );
    logger.green('  Current manager defined as ' + manager);

    if (registry) {
      onUse(registry);
    }
  }
}

function onLogin(name, args) {
  const loginCmd = ['login'];
  const registry = registries[registries[name] ? name : 'npm'].registry;
  const manager = MANAGE[getManager()];

  if (isNewYarn(manager)) {
    cmdWithRegistry('npm', registry, loginCmd, args);
    loginCmd.unshift('npm');
  }

  cmdWithRegistry(manager, registry, loginCmd, args);
}

function onPublish(name, args) {
  publishOrUnpublish(name, args);
}

function onUnpublish(name, args) {
  publishOrUnpublish(name, args, 'un');
}

function publishOrUnpublish(name, args, unpublish = '') {
  cmdWithRegistry(
    'npm',
    registries[registries[name] ? name : 'npm'].registry,
    [unpublish + 'publish'],
    args
  );
}

function onSet(name, key, value) {
  const config = getCustomRegistries();

  if (!config[name]) {
    logger.red(NO_NAME + name);
    return;
  }

  config[name][key] = value;
  write(getConfigPath(), iniStringify(config));
  logger.green('  Registry ' + name + ' set ' + key + ' to ' + value);
}

function onSetScope(scope, name) {
  if (!registries[name]) {
    logger.red(NO_NAME + name);
    return;
  }

  exec('npm config set @' + scope + ':registry ' + registries[name]);
}

function onDelScope(scope) {
  exec('npm config rm @' + scope + ':registry');
}

function onHelp() {
  // @ts-ignore
  log(read('./README.md', 'utf8').match(/Usage\s*```bash([\s\S]*?)\s*```/)[1]);
}

function testRegistry(registry, key) {
  const request = registry.startsWith('http:')
    ? require('http')
    : require('https');
  const startTime = Date.now();
  let timer;
  const req = request.get(registry + 'react', () => {
    const endTime = Date.now();
    log(getRegistryPrint('   ', key, endTime - startTime + 'ms'));
    timer && clearTimeout(timer);
  });
  req.on('error', (err) => {
    logger.red(getRegistryPrint('   ', key, err.message));
  });
  timer = setTimeout(() => {
    !req.destroyed && req.destroy(new Error('Timeout'));
  }, 5000);
}

function getCurrentRegistry(manager) {
  const url = exec(
    MANAGE[manager] + ' config get ' + getRegistryCmd(MANAGE[manager])
  );
  if (!url) return '';
  return addEndSlash(url.toString().trim());
}

function getRegistry() {
  return {
    n: getCurrentRegistry('n'),
    y: getCurrentRegistry('y'),
    p: getCurrentRegistry('p'),
  };
}

function setRegistry(registry, manager) {
  const pkgM = MANAGE[manager];
  if (!pkgM) return;
  exec(pkgM + ' config set ' + getRegistryCmd(pkgM) + ' ' + registry);
  return true;
}

function getRegistryPrint(prefix, key, value) {
  return `${prefix}${(key + ' ').padEnd(PADLEN, '-')} ${value}`;
}

function getConfigPath() {
  return (process.env.HOME || process.env.USERPROFILE) + '/.nrmrc';
}

function getRegistries() {
  return Object.assign({}, defRegistries, getCustomRegistries());
}

function getCustomRegistries() {
  const configPath = getConfigPath();

  if (exists(configPath)) {
    return iniParse(read(configPath, 'utf-8'));
  }

  return {};
}

function getRegistryCmd(manger) {
  return isNewYarn(manger) ? 'npmRegistryServer' : 'registry';
}

function addEndSlash(registry) {
  return registry.endsWith('/') ? registry : registry + '/';
}

function cmdWithRegistry(cmd, registry, pres, args) {
  return spawn(cmd, [...pres, '--registry=' + registry, ...args], ioOp);
}

function getManager() {
  return require(nruPath).define;
}

function isNewYarn(manager) {
  if (manager !== 'yarn') return;
  const ver = exec('yarn -v');
  if (!ver) return;
  return !ver.toString().startsWith('1.');
}

function iniParse(str) {
  const lines = str.split(/\r\n|\r|\n/);
  const result = {};
  let section = null;
  let match;
  lines.forEach((line) => {
    if (/^\s*[;#]/.test(line)) {
      return;
    }

    if ((match = line.match(/^\s*\[([^\]]*)\]\s*$/))) {
      section = match[1];
      return;
    }

    if ((match = line.match(/^\s*([\w\.\-_]+)\s*=\s*(.*?)\s*$/))) {
      const key = match[1];
      let value = match[2];

      if (value.charAt(0) === '"') {
        value = value
          .replace(/\\(["\\])/g, '$1')
          .replace(/^(["'])(.*)\1$/, '$2');
      } else {
        value = value.replace(/\\(\\)/g, '$1');
      }

      if (!section) {
        section = 'default';
      }

      if (!result[section]) {
        result[section] = {};
      }

      result[section][key] = value;
      return;
    }

    if (line.length === 0 && section) {
      section = null;
    }
  });
  return result;
}

function iniStringify(obj) {
  let result = '';
  oKeys(obj).forEach((section) => {
    result += '[' + section + ']\n';
    oKeys(obj[section]).forEach((key) => {
      result += key + '=' + obj[section][key] + '\n';
    });
    result += '\n';
  });
  return result;
}
