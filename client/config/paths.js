const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  appHTML: resolveApp('public/index.html'),
  appIndex: resolveApp('src/index.js'),
  appBuild: resolveApp('build'),
  components: resolveApp('src/components/'),
  config: resolveApp('src/config/'),
  constants: resolveApp('src/constants/'),
  dotenv: resolveApp('./.env'),
  features: resolveApp('src/features/'),
  store: resolveApp('src/store/'),
  utils: resolveApp('src/utils/')
};
