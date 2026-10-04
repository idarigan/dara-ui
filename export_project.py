import os
import sys
import hashlib
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from typing import List, Dict, Optional, Set
import argparse


class AdvancedProjectExporter:
    
    CODE_EXTENSIONS = {
        # Web & JavaScript/TypeScript
        '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts',
        '.vue', '.svelte', '.astro', '.html', '.htm', '.xhtml',
        '.css', '.scss', '.sass', '.less', '.styl', '.stylus',
        '.json', '.jsonc', '.json5', '.geojson', '.topojson',
        
        # Python
        '.py', '.pyi', '.pyx', '.pxd', '.pxi', '.pyw', '.ipynb',
        
        # Config files
        '.env', '.env.example', '.env.local', '.env.development',
        '.env.production', '.env.test', '.env.staging',
        '.gitignore', '.gitattributes', '.gitmodules', '.gitkeep',
        '.editorconfig', '.prettierrc', '.prettierignore',
        '.eslintrc', '.eslintignore', '.stylelintrc', '.babelrc',
        '.browserslistrc', '.npmrc', '.yarnrc', '.nvmrc',
        '.node-version', '.python-version', '.ruby-version',
        '.tool-versions', '.dockerignore', '.helmignore',
        '.terraformignore', '.dockerignore', '.npmignore',
        
        # Shell & Scripts
        '.sh', '.bash', '.zsh', '.fish', '.ksh', '.csh', '.tcsh',
        '.ps1', '.psm1', '.psd1', '.bat', '.cmd', '.vbs',
        
        # Programming languages
        '.php', '.phtml', '.rb', '.erb', '.rake', '.gemspec',
        '.go', '.mod', '.sum', '.rs', '.toml',
        '.java', '.class', '.jar', '.gradle', '.kt', '.kts',
        '.swift', '.m', '.mm', '.c', '.cpp', '.cc', '.cxx',
        '.h', '.hpp', '.hh', '.hxx', '.cs', '.fs', '.vb',
        '.scala', '.sc', '.clj', '.cljs', '.cljc', '.edn',
        '.dart', '.r', '.R', '.jl', '.lua', '.pl', '.pm',
        '.nim', '.zig', '.v', '.sv', '.vhd', '.vhdl',
        
        # Data & Query
        '.sql', '.graphql', '.gql', '.proto', '.avro', '.thrift',
        '.csv', '.tsv', '.xml', '.xsl', '.xslt', '.xsd', '.dtd',
        '.yaml', '.yml', '.ini', '.cfg', '.conf', '.properties',
        '.toml', '.lock', '.plist',
        
        # Documentation
        '.md', '.markdown', '.mdx', '.rst', '.adoc', '.asciidoc',
        '.tex', '.bib', '.org', '.pod', '.txt', '.text',
        
        # Template engines
        '.ejs', '.hbs', '.handlebars', '.mustache', '.twig',
        '.jinja', '.jinja2', '.j2', '.liquid', '.pug', '.jade',
        '.haml', '.slim', '.njk', '.nunjucks', '.eta',
        
        # Graphics & Shaders
        '.svg', '.glsl', '.vert', '.frag', '.comp', '.geom',
        '.tesc', '.tese', '.hlsl', '.metal', '.shader',
        
        # Other
        '.diff', '.patch', '.rej', '.orig', '.bak', '.log',
        '.storyboard', '.xib', '.nib', '.pbxproj',
        '.xcworkspacedata', '.xcconfig', '.entitlements',
    }
    
    # These files are ALWAYS included regardless of extension
    IMPORTANT_FILENAMES = {
        # Node.js & Package Managers
        'package.json', 'package-lock.json', 'yarn.lock',
        'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'lerna.json',
        'nx.json', 'turbo.json', 'rush.json', 'bower.json',
        '.npmrc', '.yarnrc', '.yarnrc.yml', '.nvmrc',
        '.node-version', '.node-version-file',
        
        # TypeScript Configs
        'tsconfig.json', 'tsconfig.base.json', 'tsconfig.app.json',
        'tsconfig.build.json', 'tsconfig.node.json', 'tsconfig.spec.json',
        'tsconfig.test.json', 'tsconfig.lib.json', 'tsconfig.server.json',
        'tsconfig.web.json', 'tsconfig.worker.json', 'tsconfig.paths.json',
        'tsconfig.eslint.json', 'tsconfig.prod.json', 'tsconfig.dev.json',
        'tsconfig.strict.json', 'tsconfig.cjs.json', 'tsconfig.esm.json',
        'tsconfig.types.json', 'tsconfig.declaration.json',
        'tsconfig.references.json', 'tsconfig.composite.json',
        'tsconfig.isomorphic.json', 'tsconfig.browser.json',
        'tsconfig.client.json', 'tsconfig.cypress.json',
        'tsconfig.e2e.json', 'tsconfig.mjs.json', 'tsconfig.next.json',
        'tsconfig.vite.json', 'tsconfig.vitest.json', 'tsconfig.jest.json',
        'tsconfig.mocha.json', 'tsconfig.webpack.json', 'tsconfig.rollup.json',
        'tsconfig.esbuild.json', 'tsconfig.swc.json',
        'tsconfig.jsonc', 'tsconfig.json5',
        'jsconfig.json', 'jsconfig.jsonc',
        
        # Vite & Build Tools
        'vite.config.ts', 'vite.config.js', 'vite.config.mjs',
        'vite.config.cjs', 'vite.config.mts', 'vite.config.cts',
        'vitest.config.ts', 'vitest.config.js', 'vitest.config.mjs',
        'vitest.config.mts', 'vitest.workspace.ts', 'vitest.workspace.js',
        'vite.workspace.ts', 'vite.workspace.js',
        'rollup.config.js', 'rollup.config.ts', 'rollup.config.mjs',
        'rollup.config.cjs', 'rollup.config.mts',
        'webpack.config.js', 'webpack.config.ts', 'webpack.config.mjs',
        'webpack.config.cjs', 'webpack.config.dev.js', 'webpack.config.prod.js',
        'webpack.common.js', 'webpack.dev.js', 'webpack.prod.js',
        'esbuild.config.js', 'esbuild.config.ts', 'esbuild.config.mjs',
        'parcel.config.js', 'snowpack.config.js', 'snowpack.config.mjs',
        'wmr.config.mjs', 'vite-plugin.config.ts',
        
        # Frontend Framework Configs
        'next.config.js', 'next.config.mjs', 'next.config.ts',
        'next.config.cjs', 'next-env.d.ts',
        'nuxt.config.js', 'nuxt.config.ts', 'nuxt.config.mjs',
        'nuxt.config.cjs', 'nuxt.config.json',
        'svelte.config.js', 'svelte.config.ts', 'svelte.config.mjs',
        'astro.config.mjs', 'astro.config.ts', 'astro.config.js',
        'remix.config.js', 'remix.config.ts', 'remix.config.mjs',
        'gatsby-config.js', 'gatsby-config.ts', 'gatsby-node.js',
        'gatsby-browser.js', 'gatsby-ssr.js',
        'angular.json', 'angular-cli.json', '.angular-cli.json',
        'vue.config.js', 'vue.config.ts', '.vuerc',
        'ember-cli-build.js', '.ember-cli',
        'ember-cli-build.js', 'testem.js',
        'quasar.config.js', 'quasar.config.ts', 'quasar.conf.js',
        'electron.vite.config.ts', 'electron.vite.config.js',
        'electron-builder.yml', 'electron-builder.yaml',
        'electron-builder.json', 'electron-builder.config.js',
        
        # CSS & Styling Configs
        'tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.cjs',
        'tailwind.config.mjs', 'tailwind.config.json',
        'postcss.config.js', 'postcss.config.ts', 'postcss.config.cjs',
        'postcss.config.mjs', 'postcss.config.json',
        'stylelint.config.js', 'stylelint.config.ts', 'stylelint.config.cjs',
        'stylelint.config.mjs', '.stylelintrc', '.stylelintrc.json',
        '.stylelintrc.js', '.stylelintrc.yml', '.stylelintrc.yaml',
        'prettier.config.js', 'prettier.config.ts', 'prettier.config.cjs',
        'prettier.config.mjs', '.prettierrc', '.prettierrc.json',
        '.prettierrc.js', '.prettierrc.yml', '.prettierrc.yaml',
        '.prettierrc.toml', '.prettierrc.cjs', '.prettierrc.mjs',
        'stencil.config.ts', 'stencil.config.js',
        
        # Linting Configs
        '.eslintrc', '.eslintrc.json', '.eslintrc.js', '.eslintrc.cjs',
        '.eslintrc.yml', '.eslintrc.yaml', '.eslintrc.ts',
        'eslint.config.js', 'eslint.config.ts', 'eslint.config.mjs',
        'eslint.config.cjs', 'eslint.config.json',
        '.eslintignore', '.eslintcache',
        'biome.json', 'biome.jsonc',
        '.oxlintrc.json', 'oxlint.config.json',
        '.stylelintrc', '.stylelintignore',
        '.htmllintrc', '.htmlhintrc', '.htmlhintrc.json',
        '.markdownlint.json', '.markdownlintrc',
        '.markdownlint-cli2.jsonc', '.markdownlint-cli2.cjs',
        '.commitlintrc', '.commitlintrc.json', '.commitlintrc.js',
        '.commitlintrc.yml', '.commitlintrc.yaml',
        'commitlint.config.js', 'commitlint.config.ts',
        'commitlint.config.cjs', 'commitlint.config.mjs',
        '.lintstagedrc', '.lintstagedrc.json', '.lintstagedrc.js',
        '.lintstagedrc.yml', '.lintstagedrc.yaml',
        'lint-staged.config.js', 'lint-staged.config.ts',
        'lint-staged.config.cjs', 'lint-staged.config.mjs',
        '.huskyrc', '.huskyrc.json', '.huskyrc.js', '.huskyrc.yml',
        '.huskyrc.yaml', 'husky.config.js', '.huskyrc.cjs',
        
        # Testing Configs
        'jest.config.js', 'jest.config.ts', 'jest.config.mjs',
        'jest.config.cjs', 'jest.config.json', 'jest.setup.js',
        'jest.setup.ts', 'jest.setup.mjs', 'jest.setup.cjs',
        'jest.preset.js', 'jest.preset.ts',
        'vitest.config.ts', 'vitest.config.js', 'vitest.setup.ts',
        'vitest.setup.js', 'vitest.workspace.ts',
        'cypress.config.js', 'cypress.config.ts', 'cypress.config.mjs',
        'cypress.config.cjs', 'cypress.env.json', 'cypress.json',
        'playwright.config.js', 'playwright.config.ts',
        'playwright.config.mjs', 'playwright.config.cjs',
        'karma.conf.js', 'karma.conf.ts', 'karma.conf.coffee',
        'protractor.conf.js', 'protractor.conf.ts',
        '.mocharc.json', '.mocharc.js', '.mocharc.yml', '.mocharc.yaml',
        '.mocharc.cjs', 'mocha.config.js', '.mocharc.jsonc',
        'jasmine.json', 'jasmine.config.js',
        'ava.config.js', 'ava.config.mjs', 'ava.config.cjs',
        'tap.config.js', '.taprc',
        'nightwatch.conf.js', 'nightwatch.conf.ts',
        'wdio.conf.js', 'wdio.conf.ts', 'wdio.conf.mjs',
        'testcafe.conf.js', '.testcaferc.json',
        
        # Babel & Transpilation
        '.babelrc', '.babelrc.json', '.babelrc.js', '.babelrc.cjs',
        '.babelrc.mjs', '.babelrc.yml', '.babelrc.yaml',
        'babel.config.js', 'babel.config.ts', 'babel.config.json',
        'babel.config.cjs', 'babel.config.mjs',
        '.browserslistrc', 'browserslist',
        'swcrc', '.swcrc', '.swcrc.json', '.swcrc.js',
        '.swcrc.cjs', '.swcrc.mjs',
        'tsup.config.ts', 'tsup.config.js', 'tsup.config.mjs',
        'tsup.config.cjs', 'tsup.config.json',
        'unbuild.config.ts', 'unbuild.config.js',
        'tsdown.config.ts', 'tsdown.config.js',
        'tsx.config.ts', 'tsx.config.js',
        
        # Monorepo & Workspace
        'lerna.json', 'nx.json', 'turbo.json', 'pnpm-workspace.yaml',
        'rush.json', 'lage.config.js', 'lage.config.json',
        'workspace.json', 'project.json', 'angular.json',
        'moon.yml', 'moon.yaml', '.moon/workspace.yml',
        'bit.json', 'bit.config.js',
        'bolt.json', '.bolt.json',
        'syncpack.config.js', '.syncpackrc',
        '.syncpackrc.json', '.syncpackrc.js',
        'changeset.json', '.changeset/config.json',
        'beachball.config.js',
        
        # Docker & Containers
        'Dockerfile', 'Dockerfile.dev', 'Dockerfile.prod',
        'Dockerfile.test', 'Dockerfile.local', 'Dockerfile.staging',
        'docker-compose.yml', 'docker-compose.yaml',
        'docker-compose.dev.yml', 'docker-compose.dev.yaml',
        'docker-compose.prod.yml', 'docker-compose.prod.yaml',
        'docker-compose.test.yml', 'docker-compose.test.yaml',
        'docker-compose.local.yml', 'docker-compose.local.yaml',
        'docker-compose.staging.yml', 'docker-compose.staging.yaml',
        'compose.yml', 'compose.yaml', 'compose.dev.yml',
        'compose.prod.yml', 'compose.test.yml',
        '.dockerignore', 'docker-bake.hcl', 'docker-bake.json',
        'Dockerfile.multistage', 'Containerfile',
        'devcontainer.json', '.devcontainer.json',
        '.devcontainer/devcontainer.json',
        
        # CI/CD
        '.gitlab-ci.yml', '.gitlab-ci.yaml',
        '.travis.yml', '.travis.yaml',
        'appveyor.yml', 'appveyor.yaml',
        'azure-pipelines.yml', 'azure-pipelines.yaml',
        'bitbucket-pipelines.yml', 'bitbucket-pipelines.yaml',
        'Jenkinsfile', 'Jenkinsfile.groovy',
        'circle.yml', '.circleci/config.yml', '.circleci/config.yaml',
        '.drone.yml', '.drone.yaml',
        'cloudbuild.yaml', 'cloudbuild.yml',
        'buildkite.yml', 'buildkite.yaml', '.buildkite/pipeline.yml',
        'codefresh.yml', 'codefresh.yaml', 'codefresh.json',
        '.woodpecker.yml', '.woodpecker.yaml',
        'semaphore.yml', '.semaphore/semaphore.yml',
        '.github/workflows/deploy.yml', '.github/workflows/ci.yml',
        '.github/workflows/test.yml', '.github/workflows/build.yml',
        '.github/workflows/release.yml', '.github/workflows/publish.yml',
        '.github/workflows/lint.yml', '.github/workflows/codeql.yml',
        '.github/dependabot.yml', '.github/dependabot.yaml',
        '.github/CODEOWNERS', 'CODEOWNERS',
        '.github/PULL_REQUEST_TEMPLATE.md',
        '.github/ISSUE_TEMPLATE.md',
        '.gitlab-ci.yml', 'renovate.json', 'renovate.json5',
        '.renovaterc', '.renovaterc.json', '.renovaterc.json5',
        'netlify.toml', 'vercel.json', 'now.json',
        'firebase.json', '.firebaserc', 'firebase.json',
        'amplify.yml', 'amplify.yaml',
        'render.yaml', 'render.yml',
        'railway.json', 'railway.toml', 'railway.app.json',
        'fly.toml', 'fly.yml', 'fly.yaml',
        'heroku.yml', 'app.json', 'Procfile',
        'serverless.yml', 'serverless.yaml', 'serverless.json',
        'serverless.ts', 'serverless.js',
        'sam.yaml', 'sam.yml', 'template.yaml', 'template.yml',
        'cdk.json', 'cdk.context.json',
        'pulumi.yaml', 'pulumi.yml', 'Pulumi.yaml', 'Pulumi.yml',
        'terraform.tfvars', 'terraform.tfvars.json',
        '.terraformrc', 'terraform.rc',
        'terragrunt.hcl', 'terragrunt.hcl.json',
        'ansible.cfg', 'ansible.yml', 'ansible.yaml',
        'playbook.yml', 'playbook.yaml',
        'Vagrantfile', 'vagrant.yml',
        
        # Package Manager Configs
        'Gemfile', 'Gemfile.lock', 'Rakefile', 'Guardfile',
        'Podfile', 'Podfile.lock', 'Cartfile', 'Cartfile.resolved',
        'Package.swift', 'Package.resolved',
        'Cargo.toml', 'Cargo.lock', 'rust-toolchain', 'rust-toolchain.toml',
        'go.mod', 'go.sum', 'go.work', 'go.work.sum',
        'requirements.txt', 'requirements-dev.txt', 'requirements-test.txt',
        'requirements-prod.txt', 'requirements-base.txt',
        'setup.py', 'setup.cfg', 'pyproject.toml', 'Pipfile',
        'Pipfile.lock', 'poetry.lock', 'poetry.toml',
        'tox.ini', '.python-version', 'runtime.txt',
        'composer.json', 'composer.lock', 'composer.phar',
        'build.gradle', 'build.gradle.kts', 'settings.gradle',
        'settings.gradle.kts', 'gradle.properties', 'gradlew',
        'gradlew.bat', 'gradle-wrapper.properties',
        'pom.xml', 'build.xml', 'ivy.xml', 'ivy-settings.xml',
        'project.clj', 'deps.edn', 'shadow-cljs.edn',
        'mix.exs', 'mix.lock', 'elixir_ls.json',
        'pubspec.yaml', 'pubspec.lock', 'analysis_options.yaml',
        'Package.swift', 'Package.resolved',
        'Project.toml', 'Manifest.toml', 'JuliaProject.toml',
        'vcpkg.json', 'conanfile.txt', 'conanfile.py',
        'CMakeLists.txt', 'CMakePresets.json', 'CTestConfig.cmake',
        'meson.build', 'meson_options.txt',
        'Makefile', 'makefile', 'GNUmakefile', 'makefile.am',
        'configure.ac', 'configure.in', 'configure',
        'Kbuild', 'Kconfig', '.config',
        
        # Runtime & Environment
        '.nvmrc', '.node-version', '.node-version-file',
        '.python-version', '.ruby-version', '.java-version',
        '.tool-versions', '.mise.toml', '.mise.local.toml',
        '.envrc', 'mise.toml', '.terraform-version',
        '.dockerignore', '.gitignore', '.npmignore',
        '.prettierignore', '.eslintignore', '.stylelintignore',
        '.markdownlintignore', '.helmignore', '.vscodeignore',
        '.snyk', '.snykignore',
        
        # Databases & ORM
        'prisma/schema.prisma', 'schema.prisma', 'prisma.config.ts',
        'drizzle.config.ts', 'drizzle.config.js',
        'knexfile.js', 'knexfile.ts', 'knexfile.mjs',
        'ormconfig.json', 'ormconfig.js', 'ormconfig.ts',
        'typeorm.config.ts', 'typeorm.config.js',
        'sequelize.config.js', 'sequelize.config.ts',
        'database.yml', 'database.yaml', 'database.json',
        'mongoose.config.js', 'mongod.conf',
        'redis.conf', 'redis.config.js',
        'init.sql', 'schema.sql', 'seed.sql', 'migrations',
        
        # Documentation & Meta
        'README', 'README.md', 'README.rst', 'README.txt',
        'CHANGELOG', 'CHANGELOG.md', 'CHANGELOG.rst',
        'CONTRIBUTING', 'CONTRIBUTING.md', 'CONTRIBUTING.rst',
        'CODE_OF_CONDUCT.md', 'SECURITY.md', 'SUPPORT.md',
        'LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENSE.rst',
        'COPYING', 'COPYING.md', 'NOTICE', 'NOTICE.md',
        'AUTHORS', 'AUTHORS.md', 'CONTRIBUTORS', 'CONTRIBUTORS.md',
        'ACKNOWLEDGMENTS.md', 'PATENTS', 'PATENTS.md',
        'MAINTAINERS', 'MAINTAINERS.md', 'OWNERS',
        'GOVERNANCE.md', 'ROADMAP.md', 'TODO.md', 'HISTORY.md',
        'FUNDING.yml', '.github/FUNDING.yml',
        'CITATION.cff', 'CITATION.bib',
        'humans.txt', 'robots.txt', 'security.txt',
        '.mailmap', '.gitmessage', '.gitmessage.txt',
        
        # Editor & IDE
        '.editorconfig', '.vimrc', '.gvimrc', '.exrc',
        '.emacs', '.emacs.d', 'init.el', '.spacemacs',
        '.vscode/settings.json', '.vscode/launch.json',
        '.vscode/tasks.json', '.vscode/extensions.json',
        '.vscode/keybindings.json', '.vscode/snippets',
        '.idea/workspace.xml', '.idea/misc.xml', '.idea/modules.xml',
        '.idea/compiler.xml', '.idea/encodings.xml',
        '.idea/vcs.xml', '.idea/codeStyles', '.idea/inspectionProfiles',
        '.editorconfig', '.sublime-project', '.sublime-workspace',
        '.atom/config.cson', '.atom/keymap.cson',
        '.vim/coc-settings.json', '.nvim/init.lua',
        '.dir-locals.el', '.projectile', '.project',
        
        # Browser & Web
        '.browserslistrc', 'browserslist', 'browserslist.json',
        'manifest.json', 'manifest.webmanifest', 'manifest.jsonld',
        'browserconfig.xml', 'crossdomain.xml', 'humans.txt',
        'robots.txt', 'sitemap.xml', 'sitemap.txt', 'sitemap.xml.gz',
        'ads.txt', 'security.txt', '.well-known/security.txt',
        'favicon.ico', 'favicon.svg', 'favicon.png',
        'apple-touch-icon.png', 'apple-touch-icon-precomposed.png',
        'browserconfig.xml', 'site.webmanifest',
        
        # Misc Config
        '.htaccess', '.htpasswd', 'web.config', 'httpd.conf',
        'nginx.conf', 'nginx.conf.template', 'default.conf',
        'apache2.conf', 'httpd.conf', '.user.ini', 'php.ini',
        'my.cnf', 'my.ini', 'postgresql.conf', 'pg_hba.conf',
        'redis.conf', 'sentinel.conf', 'mongod.conf', 'mongo.conf',
        'elasticsearch.yml', 'kibana.yml', 'logstash.yml',
        'kafka.properties', 'zookeeper.properties',
        'rabbitmq.conf', 'rabbitmq.config',
        'mosquitto.conf', 'mosquitto.conf.example',
        'graphql.config.js', 'graphql.config.ts',
        'codegen.yml', 'codegen.yaml', 'codegen.json',
        '.graphqlconfig', '.graphqlconfig.yml', '.graphqlconfig.yaml',
        'apollo.config.js', 'apollo.config.ts',
        'relay.config.js', 'relay.config.json',
        
        # Locks & Generated
        'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
        'bun.lockb', 'deno.lock', 'shrinkwrap.json', 'npm-shrinkwrap.json',
        'Gemfile.lock', 'Podfile.lock', 'Cartfile.resolved',
        'Cargo.lock', 'go.sum', 'poetry.lock', 'Pipfile.lock',
        'composer.lock', 'mix.lock', 'pubspec.lock', 'Package.resolved',
        'flake.lock', 'gradle.lockfile',
        '.lock', '.lockfile',
    }
    
    # These filenames follow patterns (prefixes/suffixes) that we should catch
    FILENAME_PATTERNS = [
        'vite.config', 'vitest.config', 'vitest.workspace',
        'vite.workspace', 'rollup.config', 'webpack.config',
        'esbuild.config', 'parcel.config', 'snowpack.config',
        'next.config', 'nuxt.config', 'svelte.config',
        'astro.config', 'remix.config', 'gatsby-config',
        'gatsby-node', 'gatsby-browser', 'gatsby-ssr',
        'tailwind.config', 'postcss.config', 'stylelint.config',
        'prettier.config', 'eslint.config', 'biome.config',
        'jest.config', 'jest.setup', 'jest.preset',
        'cypress.config', 'playwright.config', 'karma.conf',
        'protractor.conf', 'mocha.config', 'nightwatch.conf',
        'wdio.conf', 'testcafe.conf', 'tsup.config',
        'unbuild.config', 'tsdown.config', 'tsx.config',
        'babel.config', 'swc.config',
        'commitlint.config', 'lint-staged.config',
        'drizzle.config', 'typeorm.config', 'sequelize.config',
        'apollo.config', 'relay.config',
        'quasar.config', 'quasar.conf', 'electron.vite.config',
        'electron-builder.config', 'prisma.config',
        'codegen.config', 'graphql.config',
        'tsconfig', 'jsconfig', 'angular',
        'docker-compose', 'compose', 'Dockerfile',
        'Jenkinsfile', 'Procfile', 'Vagrantfile',
        'Makefile', 'makefile', 'GNUmakefile',
    ]
    
    EXCLUDE_DIRS = {
        'node_modules', '__pycache__', '.git', '.svn', '.hg', '.bzr',
        '.tox', '.eggs', '*.egg-info', '.pytest_cache', '.mypy_cache',
        '.coverage', 'htmlcov', '.nyc_output', 'coverage', '.next',
        '.nuxt', '.vuepress', 'dist', 'build', 'out', 'output',
        '.cache', '.parcel-cache', '.turbo', '.vercel', '.netlify',
        'target', 'bin', 'obj', '.vs', '.vscode', '.idea',
        'vendor', 'bower_components', 'jspm_packages',
        '.DS_Store', 'Thumbs.db', 'desktop.ini', '.Trash',
        '.Spotlight-V100', '.fseventsd', '.TemporaryItems',
        '.DocumentRevisions-V100', '.VolumeIcon.icns',
        '.AppleDouble', '.LSOverride', '.DocumentRevisions-V100',
        '.Trashes', '.AppleDB', '.AppleDesktop', 'Network Trash Folder',
        'Temporary Items', '.apdisk',
        'venv', 'env', '.venv', '.env', 'virtualenv', 'ENV',
        'site-packages', 'lib64', 'pip-wheel-metadata',
        '.ipynb_checkpoints', '.dmypy.json', 'dmypy.json',
        'cython_debug', '.Python',
        '.sass-cache', '.parcel-cache', '.rollup.cache',
        '.webpack', '.vite', '.docusaurus', '.gatsby-cache',
        '.serverless', '.aws-sam', '.terraform', '.pulumi',
        '.gradle', '.m2', '.ivy2', '.sbt', '.coursier',
        '.cargo', '.rustup', '.go', '.cache',
    }
    
    EXCLUDE_FILES = {
        'desktop.ini', 'Thumbs.db', '.DS_Store', '.gitkeep',
        # Compiled Python
        '*.pyc', '*.pyo', '*.pyd', '*.so', '*.egg',
        # Compiled C/C++
        '*.o', '*.obj', '*.a', '*.lib', '*.dll', '*.dylib',
        '*.exe', '*.out', '*.app', '*.ko', '*.mod', '*.lo',
        '*.la', '*.lai', '*.al', '*.als', '*.slo', '*.sla',
        '*.so.*', '*.dylib.*',
        # Compiled Java
        '*.class', '*.jar', '*.war', '*.ear', '*.aar',
        '*.nar', '*.apk', '*.dex',
        # Compiled .NET
        '*.dll', '*.pdb', '*.nupkg', '*.snupkg',
        # Compiled Swift
        '*.swiftmodule', '*.swiftdoc', '*.swiftsourceinfo',
        # Xcode
        '*.xcuserstate', '*.moved-aside', '*.hmap', '*.ipa',
        '*.dSYM.zip', '*.dSYM', '*.xcarchive',
        '*.pbxuser', '*.mode1v3', '*.mode2v3', '*.perspectivev3',
        '*.xccheckout', '*.moved-aside', '*.xcscmblueprint',
        # Archives
        '*.zip', '*.tar', '*.tar.gz', '*.tgz', '*.tar.bz2',
        '*.tbz2', '*.tar.xz', '*.txz', '*.tar.zst', '*.tzst',
        '*.rar', '*.7z', '*.gz', '*.bz2', '*.xz', '*.zst',
        '*.lz', '*.lzma', '*.lzo', '*.zipx', '*.cab', '*.arj',
        '*.war', '*.ear', '*.jar', '*.apk', '*.ipa',
        # Images (usually not useful in code exports)
        '*.jpg', '*.jpeg', '*.png', '*.gif', '*.bmp', '*.ico',
        '*.webp', '*.tiff', '*.tif', '*.psd', '*.ai', '*.eps',
        '*.raw', '*.cr2', '*.nef', '*.arw', '*.dng', '*.heic',
        '*.heif', '*.avif', '*.jfif', '*.pjpeg', '*.pjp',
        # Audio/Video
        '*.mp3', '*.mp4', '*.avi', '*.mov', '*.wmv', '*.flv',
        '*.webm', '*.mkv', '*.m4a', '*.wav', '*.flac', '*.aac',
        '*.ogg', '*.opus', '*.wma', '*.m4v', '*.mpg', '*.mpeg',
        '*.3gp', '*.3g2', '*.m2v', '*.ogv', '*.ts', '*.m3u8',
        # Fonts
        '*.ttf', '*.otf', '*.woff', '*.woff2', '*.eot',
        '*.fon', '*.fnt', '*.pfb', '*.pfm', '*.afm',
        # Documents
        '*.pdf', '*.doc', '*.docx', '*.xls', '*.xlsx', '*.ppt',
        '*.pptx', '*.odt', '*.ods', '*.odp', '*.epub', '*.mobi',
        '*.pages', '*.numbers', '*.key', '*.rtf',
        # Disk Images & Packages
        '*.iso', '*.dmg', '*.pkg', '*.deb', '*.rpm', '*.msi',
        '*.appx', '*.appxbundle', '*.msix', '*.msixbundle',
        '*.snap', '*.flatpak', '*.appimage',
        # Databases
        '*.db', '*.sqlite', '*.sqlite3', '*.mdb', '*.accdb',
        '*.dbf', '*.frm', '*.myd', '*.myi', '*.ibd', '*.idx',
        # Lock files that are binary or huge
        '*.lockb',
        # Cache/temp
        '*.log', '*.pid', '*.seed', '*.pid.lock', '*.cache',
        '*.tmp', '*.temp', '*.swp', '*.swo', '*.swn', '*~',
        '*.bak', '*.backup', '*.old', '*.orig', '*.rej',
        '*.crdownload', '*.part', '*.partial',
        # Source maps (usually generated)
        '*.map', '*.js.map', '*.css.map',
        # Minified files (usually generated)
        '*.min.js', '*.min.css', '*.min.html',
        '*-min.js', '*-min.css', '*-min.html',
        # Bundle files
        '*.bundle.js', '*.bundle.css', '*.chunk.js', '*.chunk.css',
        # Coverage
        '*.lcov', '*.coverage', '.coverage.*',
        # Misc
        '*.suo', '*.user', '*.userosscache', '*.sln.docstates',
        '*.VC.db', '*.VC.VC.opendb', '*.nupkg', '*.snupkg',
    }
    
    def __init__(self, project_root: str = '.', output_file: str = None, 
                 max_file_size: int = None, max_lines_per_file: int = None,
                 include_patterns: List[str] = None, exclude_patterns: List[str] = None,
                 truncate_large_files: bool = False,
                 include_binary: bool = False):
        self.project_root = Path(project_root).resolve()
        self.output_file = Path(output_file) if output_file else self._generate_output_name()
        self.file_count = 0
        self.total_size = 0
        self.stats = defaultdict(int)
        self.file_hashes = {}
        self.skipped_files = []
        self.truncated_files = []
        
        # Configuration options
        self.max_file_size = max_file_size or 5 * 1024 * 1024  # 5MB default
        self.max_lines_per_file = max_lines_per_file or 5000
        self.truncate_large_files = truncate_large_files
        self.include_binary = include_binary
        
        # By default, include everything except excluded dirs
        self.include_patterns = include_patterns or []
        self.exclude_patterns = exclude_patterns or []
        
    def _generate_output_name(self) -> Path:
        project_name = self.project_root.name.replace(' ', '_').lower()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        return Path(f"{project_name}_export_{timestamp}.txt")
    
    def _matches_important_filename(self, filename: str) -> bool:
        """Check if filename matches any important config file"""
        # Direct match
        if filename in self.IMPORTANT_FILENAMES:
            return True
        
        # Pattern match (e.g., vite.config.ts, vite.config.js, etc.)
        for pattern in self.FILENAME_PATTERNS:
            if filename == pattern or filename.startswith(pattern + '.'):
                return True
            # Handle cases like "vite.config.dev.ts"
            if filename.startswith(pattern + '.') or filename.startswith(pattern + '-'):
                return True
        
        # Handle tsconfig.*.json variants
        if filename.startswith('tsconfig') and (filename.endswith('.json') or filename.endswith('.jsonc') or filename.endswith('.json5')):
            return True
        if filename.startswith('jsconfig') and (filename.endswith('.json') or filename.endswith('.jsonc')):
            return True
        
        # Handle .env.* files
        if filename.startswith('.env'):
            return True
        
        # Handle docker-compose variants
        if filename.startswith('docker-compose') or filename.startswith('compose.'):
            return True
        
        # Handle Dockerfile variants
        if filename.startswith('Dockerfile') or filename.startswith('Containerfile'):
            return True
        
        # Handle .eslintrc.* variants
        if filename.startswith('.eslintrc') or filename.startswith('eslint.config'):
            return True
        
        # Handle .prettierrc.* variants
        if filename.startswith('.prettierrc') or filename.startswith('prettier.config'):
            return True
        
        # Handle .stylelintrc.* variants
        if filename.startswith('.stylelintrc') or filename.startswith('stylelint.config'):
            return True
        
        # Handle jest config variants
        if filename.startswith('jest.config') or filename.startswith('jest.setup') or filename.startswith('jest.preset'):
            return True
        
        # Handle cypress config variants
        if filename.startswith('cypress.config') or filename == 'cypress.json':
            return True
        
        # Handle playwright config variants
        if filename.startswith('playwright.config'):
            return True
        
        # Handle vitest config variants
        if filename.startswith('vitest.config') or filename.startswith('vitest.workspace') or filename.startswith('vitest.setup'):
            return True
        
        # Handle vite config variants
        if filename.startswith('vite.config') or filename.startswith('vite.workspace'):
            return True
        
        # Handle tailwind config variants
        if filename.startswith('tailwind.config'):
            return True
        
        # Handle postcss config variants
        if filename.startswith('postcss.config'):
            return True
        
        # Handle babel config variants
        if filename.startswith('babel.config') or filename.startswith('.babelrc'):
            return True
        
        # Handle swc config variants
        if filename.startswith('.swcrc') or filename == 'swcrc':
            return True
        
        # Handle tsup/unbuild/tsdown/tsx config
        for prefix in ['tsup.config', 'unbuild.config', 'tsdown.config', 'tsx.config']:
            if filename.startswith(prefix):
                return True
        
        # Handle rollup/webpack/esbuild config
        for prefix in ['rollup.config', 'webpack.config', 'esbuild.config']:
            if filename.startswith(prefix):
                return True
        
        # Handle framework configs
        for prefix in ['next.config', 'nuxt.config', 'svelte.config', 'astro.config',
                       'remix.config', 'gatsby-config', 'gatsby-node', 'gatsby-browser',
                       'gatsby-ssr', 'vue.config', 'quasar.config', 'quasar.conf',
                       'electron.vite.config', 'electron-builder.config',
                       'stencil.config', 'angular']:
            if filename.startswith(prefix):
                return True
        
        # Handle commitlint, lint-staged, husky
        for prefix in ['commitlint.config', '.commitlintrc', 'lint-staged.config',
                       '.lintstagedrc', 'husky.config', '.huskyrc']:
            if filename.startswith(prefix):
                return True
        
        # Handle database configs
        for prefix in ['prisma.config', 'drizzle.config', 'knexfile',
                       'ormconfig', 'typeorm.config', 'sequelize.config',
                       'mongoose.config', 'database']:
            if filename.startswith(prefix):
                return True
        
        # Handle GraphQL
        for prefix in ['graphql.config', 'codegen', 'apollo.config', 'relay.config']:
            if filename.startswith(prefix):
                return True
        
        return False
    
    def should_include_file(self, file_path: Path) -> bool:
        """Enhanced file inclusion check with size and pattern filters"""
        if not file_path.is_file():
            return False
        
        filename = file_path.name
        
        # IMPORTANT: Always include important config files (package.json, vite.config.ts, tsconfig, etc.)
        if self._matches_important_filename(filename):
            return True
        
        # Check file name exclusions
        if filename in self.EXCLUDE_FILES:
            return False
        
        # Check if file matches any exclude patterns (with wildcards)
        import fnmatch
        for pattern in self.EXCLUDE_FILES:
            if '*' in pattern and fnmatch.fnmatch(filename, pattern):
                return False
        
        # Check directory exclusions
        for parent in file_path.parents:
            if parent.name in self.EXCLUDE_DIRS:
                return False
            for exclude_dir in self.EXCLUDE_DIRS:
                if '*' in exclude_dir and fnmatch.fnmatch(parent.name, exclude_dir):
                    return False
        
        # Check include patterns (only include files in specified directories)
        try:
            relative_path = file_path.relative_to(self.project_root)
            if self.include_patterns:
                is_included = False
                for pattern in self.include_patterns:
                    if str(relative_path).startswith(pattern) or pattern in str(relative_path):
                        is_included = True
                        break
                if not is_included:
                    return False
        except ValueError:
            pass
        
        # Check exclude patterns
        if self.exclude_patterns:
            for pattern in self.exclude_patterns:
                if pattern in str(file_path):
                    return False
        
        # Check file size
        try:
            file_size = file_path.stat().st_size
            if file_size > self.max_file_size:
                if self.truncate_large_files:
                    self.truncated_files.append(str(file_path))
                    return True
                else:
                    self.skipped_files.append(f"{file_path} (size: {file_size:,} bytes)")
                    return False
        except:
            return False
        
        # Check if it's a code file by extension
        if file_path.suffix.lower() in self.CODE_EXTENSIONS:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    f.read(1024)
                return True
            except (UnicodeDecodeError, IOError):
                if self.include_binary:
                    return True
                return False
        
        # Include files with no extension if they're small text files
        if not file_path.suffix:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    f.read(1024)
                return True
            except (UnicodeDecodeError, IOError):
                if self.include_binary:
                    return True
                return False
        
        return False
    
    def generate_tree(self, directory: Path = None, prefix: str = '', 
                     max_depth: int = 15, current_depth: int = 0) -> List[str]:
        if directory is None:
            directory = self.project_root
        
        if current_depth >= max_depth:
            return [f"{prefix}└── ... (max depth reached)"]
        
        tree_lines = []
        entries = []
        
        try:
            for entry in sorted(directory.iterdir()):
                if entry.name in self.EXCLUDE_DIRS:
                    continue
                import fnmatch
                skip = False
                for exclude_dir in self.EXCLUDE_DIRS:
                    if '*' in exclude_dir and fnmatch.fnmatch(entry.name, exclude_dir):
                        skip = True
                        break
                if skip:
                    continue
                    
                if entry.is_file() and not self.should_include_file(entry):
                    continue
                entries.append(entry)
        except PermissionError:
            return tree_lines
        
        for i, entry in enumerate(entries):
            is_last_entry = (i == len(entries) - 1)
            connector = '└── ' if is_last_entry else '├── '
            new_prefix = prefix + ('    ' if is_last_entry else '│   ')
            
            if entry.is_dir():
                tree_lines.append(f"{prefix}{connector}{entry.name}/")
                tree_lines.extend(
                    self.generate_tree(entry, new_prefix, max_depth, current_depth + 1)
                )
            else:
                size = entry.stat().st_size
                size_str = self._format_size(size)
                # Highlight important config files
                marker = " ⭐" if self._matches_important_filename(entry.name) else ""
                tree_lines.append(f"{prefix}{connector}{entry.name} ({size_str}){marker}")
        
        return tree_lines
    
    def _format_size(self, size: int) -> str:
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    
    def _calculate_hash(self, content: str) -> str:
        return hashlib.sha256(content.encode('utf-8', errors='ignore')).hexdigest()[:8]
    
    def _count_lines_of_code(self, content: str, language: str) -> Dict[str, int]:
        lines = content.split('\n')
        total_lines = len(lines)
        blank_lines = len([l for l in lines if not l.strip()])
        
        comment_patterns = {
            'python': '#', 'javascript': '//', 'typescript': '//',
            'jsx': '//', 'tsx': '//', 'css': '/*', 'html': '<!--',
            'bash': '#', 'sql': '--', 'yaml': '#', 'ruby': '#',
            'php': '//', 'java': '//', 'c': '//', 'cpp': '//',
            'csharp': '//', 'go': '//', 'rust': '//', 'swift': '//',
            'kotlin': '//', 'scala': '//',
        }
        
        comment_prefix = comment_patterns.get(language, '#')
        comment_lines = len([l for l in lines if l.strip().startswith(comment_prefix)])
        code_lines = total_lines - blank_lines - comment_lines
        
        return {
            'total': total_lines,
            'code': code_lines,
            'blank': blank_lines,
            'comment': comment_lines
        }
    
    def read_file_content(self, file_path: Path) -> Optional[str]:
        """Read file content with size limits and truncation support"""
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1', 'ascii', 'utf-16']
        
        for encoding in encodings:
            try:
                file_size = file_path.stat().st_size
                if file_size > self.max_file_size and self.truncate_large_files:
                    with open(file_path, 'r', encoding=encoding, errors='replace') as f:
                        lines = []
                        line_count = 0
                        for line in f:
                            if line_count >= self.max_lines_per_file:
                                lines.append(f"\n... (content truncated after {self.max_lines_per_file} lines)\n")
                                lines.append(f"Original file size: {file_size:,} bytes\n")
                                break
                            lines.append(line)
                            line_count += 1
                        content = ''.join(lines)
                        file_hash = self._calculate_hash(content)
                        self.file_hashes[str(file_path.relative_to(self.project_root))] = file_hash
                        return content
                else:
                    with open(file_path, 'r', encoding=encoding, errors='replace') as f:
                        content = f.read()
                    
                    lines = content.split('\n')
                    if len(lines) > self.max_lines_per_file and self.truncate_large_files:
                        truncated_content = '\n'.join(lines[:self.max_lines_per_file])
                        truncated_content += f"\n\n... (content truncated after {self.max_lines_per_file} lines)\n"
                        truncated_content += f"Original file had {len(lines)} lines\n"
                        content = truncated_content
                        self.truncated_files.append(str(file_path))
                    
                    file_hash = self._calculate_hash(content)
                    self.file_hashes[str(file_path.relative_to(self.project_root))] = file_hash
                    return content
                    
            except UnicodeDecodeError:
                continue
            except Exception:
                if self.include_binary:
                    try:
                        with open(file_path, 'rb') as f:
                            content = f.read()
                        import base64
                        encoded = base64.b64encode(content).decode('ascii')
                        return f"[BINARY FILE - Base64 encoded]\n{encoded}"
                    except:
                        return None
                return None
        
        return None
    
    def get_file_language(self, file_path: Path) -> str:
        extension_map = {
            '.py': 'python', '.js': 'javascript', '.jsx': 'jsx',
            '.mjs': 'javascript', '.cjs': 'javascript',
            '.ts': 'typescript', '.tsx': 'tsx', '.mts': 'typescript', '.cts': 'typescript',
            '.html': 'html', '.htm': 'html', '.xhtml': 'html',
            '.css': 'css', '.scss': 'scss', '.sass': 'sass', '.less': 'less',
            '.styl': 'stylus', '.stylus': 'stylus',
            '.json': 'json', '.jsonc': 'json', '.json5': 'json',
            '.xml': 'xml', '.yaml': 'yaml', '.yml': 'yaml',
            '.md': 'markdown', '.markdown': 'markdown', '.mdx': 'mdx',
            '.sh': 'bash', '.bash': 'bash', '.zsh': 'bash', '.fish': 'fish',
            '.ps1': 'powershell', '.bat': 'batch', '.cmd': 'batch',
            '.sql': 'sql', '.graphql': 'graphql', '.gql': 'graphql',
            '.java': 'java', '.kt': 'kotlin', '.kts': 'kotlin',
            '.swift': 'swift', '.rs': 'rust', '.go': 'go',
            '.php': 'php', '.rb': 'ruby', '.c': 'c', '.cpp': 'cpp',
            '.cc': 'cpp', '.cxx': 'cpp', '.h': 'c', '.hpp': 'cpp',
            '.cs': 'csharp', '.fs': 'fsharp', '.vb': 'vbnet',
            '.toml': 'toml', '.ini': 'ini', '.cfg': 'ini', '.conf': 'ini',
            '.env': 'dotenv', '.gitignore': 'plaintext',
            '.glsl': 'glsl', '.vert': 'glsl', '.frag': 'glsl',
            '.vue': 'vue', '.svelte': 'svelte', '.astro': 'astro',
            '.dart': 'dart', '.r': 'r', '.R': 'r', '.jl': 'julia',
            '.lua': 'lua', '.pl': 'perl', '.pm': 'perl',
            '.scala': 'scala', '.clj': 'clojure', '.cljs': 'clojure',
            '.ex': 'elixir', '.exs': 'elixir', '.erl': 'erlang',
            '.hrl': 'erlang', '.hs': 'haskell', '.lhs': 'haskell',
            '.ml': 'ocaml', '.mli': 'ocaml', '.fs': 'fsharp',
            '.fsx': 'fsharp', '.nim': 'nim', '.zig': 'zig',
            '.v': 'verilog', '.sv': 'systemverilog',
            '.vhd': 'vhdl', '.vhdl': 'vhdl',
            '.tex': 'latex', '.bib': 'bibtex', '.rst': 'rst',
            '.adoc': 'asciidoc', '.asciidoc': 'asciidoc',
            '.ejs': 'ejs', '.hbs': 'handlebars', '.mustache': 'mustache',
            '.twig': 'twig', '.jinja': 'jinja', '.jinja2': 'jinja',
            '.j2': 'jinja', '.liquid': 'liquid', '.pug': 'pug',
            '.jade': 'pug', '.haml': 'haml', '.slim': 'slim',
            '.erb': 'erb', '.njk': 'nunjucks', '.eta': 'eta',
            '.prisma': 'prisma', '.proto': 'protobuf',
            '.tf': 'terraform', '.tfvars': 'terraform',
            '.hcl': 'hcl', '.nomad': 'hcl', '.vcl': 'vcl',
        }
        
        ext = file_path.suffix.lower()
        if ext in extension_map:
            return extension_map[ext]
        
        filename = file_path.name.lower()
        
        # Special filenames
        if filename in ('dockerfile', 'containerfile') or filename.startswith('dockerfile.'):
            return 'dockerfile'
        elif filename in ('makefile', 'gnumakefile') or filename.startswith('makefile.'):
            return 'makefile'
        elif filename == 'cmakelists.txt':
            return 'cmake'
        elif filename in ('gemfile', 'rakefile', 'podfile', 'vagrantfile', 'brewfile',
                         'fastfile', 'appfile', 'deliverfile', 'snapfile',
                         'matchfile', 'gymfile', 'scanfile', 'pluginfile',
                         'guardfile'):
            return 'ruby'
        elif filename == 'jenkinsfile' or filename.startswith('jenkinsfile.'):
            return 'groovy'
        elif filename == 'procfile':
            return 'plaintext'
        elif filename == 'cartfile':
            return 'plaintext'
        elif filename == 'package.swift' or filename == 'podfile':
            return 'swift'
        elif filename.startswith('docker-compose') or filename.startswith('compose.'):
            return 'yaml'
        elif filename.startswith('.env'):
            return 'dotenv'
        elif filename.startswith('tsconfig') or filename.startswith('jsconfig'):
            return 'json'
        elif filename in ('package.json', 'package-lock.json', 'composer.json',
                         'bower.json', 'manifest.json', 'angular.json',
                         'nx.json', 'turbo.json', 'lerna.json'):
            return 'json'
        elif filename in ('yarn.lock', 'pnpm-lock.yaml', 'cargo.lock',
                         'gemfile.lock', 'podfile.lock', 'poetry.lock',
                         'pipfile.lock', 'composer.lock', 'mix.lock',
                         'pubspec.lock', 'package.resolved'):
            return 'plaintext'
        elif filename in ('cargo.toml', 'pyproject.toml', 'poetry.toml',
                         'fly.toml', 'netlify.toml', 'railway.toml'):
            return 'toml'
        elif filename in ('go.mod', 'go.sum'):
            return 'go'
        elif filename in ('requirements.txt', 'requirements-dev.txt',
                         'requirements-test.txt', 'requirements-prod.txt'):
            return 'pip-requirements'
        elif filename in ('setup.py',):
            return 'python'
        elif filename in ('setup.cfg',):
            return 'ini'
        elif filename in ('pipfile',):
            return 'toml'
        elif filename in ('gemfile', 'rakefile'):
            return 'ruby'
        elif filename in ('build.gradle', 'build.gradle.kts',
                         'settings.gradle', 'settings.gradle.kts'):
            return 'groovy'
        elif filename == 'gradle.properties':
            return 'properties'
        elif filename in ('pom.xml', 'build.xml', 'ivy.xml'):
            return 'xml'
        elif filename in ('project.clj', 'deps.edn'):
            return 'clojure'
        elif filename in ('mix.exs', 'mix.lock'):
            return 'elixir'
        elif filename in ('pubspec.yaml', 'pubspec.lock'):
            return 'yaml'
        elif filename == 'analysis_options.yaml':
            return 'yaml'
        elif filename in ('cargo.toml', 'rust-toolchain.toml'):
            return 'toml'
        elif filename in ('composer.json', 'composer.lock'):
            return 'json'
        elif filename in ('go.mod', 'go.sum', 'go.work', 'go.work.sum'):
            return 'go'
        elif filename in ('package.swift', 'package.resolved'):
            return 'swift'
        elif filename in ('podfile', 'podfile.lock', 'cartfile', 'cartfile.resolved'):
            return 'ruby'
        elif filename == 'vcpkg.json':
            return 'json'
        elif filename in ('conanfile.txt',):
            return 'ini'
        elif filename in ('conanfile.py',):
            return 'python'
        elif filename == 'cmakepresets.json':
            return 'json'
        elif filename == 'ctestconfig.cmake':
            return 'cmake'
        elif filename in ('meson.build', 'meson_options.txt'):
            return 'meson'
        elif filename in ('makefile', 'gnumakefile'):
            return 'makefile'
        elif filename in ('configure.ac', 'configure.in', 'configure'):
            return 'bash'
        elif filename in ('kbuild', 'kconfig', '.config'):
            return 'kconfig'
        elif filename in ('.gitignore', '.gitattributes', '.gitmodules',
                         '.npmignore', '.dockerignore', '.eslintignore',
                         '.prettierignore', '.stylelintignore',
                         '.markdownlintignore', '.helmignore'):
            return 'gitignore'
        elif filename in ('license', 'license.md', 'license.txt',
                         'copying', 'notice'):
            return 'plaintext'
        elif filename in ('readme', 'readme.md', 'readme.rst', 'readme.txt'):
            return 'markdown'
        elif filename in ('changelog', 'changelog.md', 'changes.md'):
            return 'markdown'
        elif filename in ('contributing', 'contributing.md', 'contributing.rst'):
            return 'markdown'
        elif filename == 'code_of_conduct.md':
            return 'markdown'
        elif filename == 'security.md':
            return 'markdown'
        elif filename in ('codeowners',):
            return 'plaintext'
        elif filename in ('docker-compose.yml', 'docker-compose.yaml',
                         'docker-compose.dev.yml', 'docker-compose.dev.yaml',
                         'docker-compose.prod.yml', 'docker-compose.prod.yaml',
                         'compose.yml', 'compose.yaml'):
            return 'yaml'
        elif filename in ('jenkinsfile',):
            return 'groovy'
        elif filename in ('procfile',):
            return 'plaintext'
        elif filename in ('vagrantfile',):
            return 'ruby'
        elif filename in ('makefile', 'gnumakefile'):
            return 'makefile'
        elif filename in ('.editorconfig',):
            return 'ini'
        elif filename in ('.envrc',):
            return 'bash'
        
        # Config files ending with common patterns
        if filename.startswith('vite.config') or filename.startswith('vitest.config'):
            return 'typescript'
        if filename.startswith('rollup.config') or filename.startswith('webpack.config'):
            return 'javascript'
        if filename.startswith('next.config') or filename.startswith('nuxt.config'):
            return 'javascript'
        if filename.startswith('tailwind.config') or filename.startswith('postcss.config'):
            return 'javascript'
        if filename.startswith('jest.config') or filename.startswith('cypress.config'):
            return 'javascript'
        if filename.startswith('playwright.config'):
            return 'typescript'
        if filename.startswith('babel.config'):
            return 'javascript'
        if filename.startswith('eslint.config'):
            return 'javascript'
        if filename.startswith('prettier.config'):
            return 'javascript'
        if filename.startswith('stylelint.config'):
            return 'javascript'
        if filename.startswith('prisma.config') or filename == 'schema.prisma':
            return 'prisma'
        if filename.startswith('drizzle.config'):
            return 'typescript'
        if filename.startswith('knexfile'):
            return 'javascript'
        if filename.startswith('tsup.config') or filename.startswith('unbuild.config'):
            return 'typescript'
        if filename.startswith('apollo.config'):
            return 'javascript'
        if filename.startswith('commitlint.config'):
            return 'javascript'
        if filename.startswith('lint-staged.config'):
            return 'javascript'
        
        return 'plaintext'
    
    def _find_duplicates(self) -> Dict[str, List[str]]:
        hash_map = defaultdict(list)
        for filepath, file_hash in self.file_hashes.items():
            hash_map[file_hash].append(filepath)
        
        return {h: files for h, files in hash_map.items() if len(files) > 1}
    
    def export(self, include_structure_only: bool = False, 
               include_stats: bool = True) -> bool:
        print(f"📂 Scanning project: {self.project_root}")
        print(f"📏 Max file size: {self.max_file_size:,} bytes ({self.max_file_size / 1024 / 1024:.1f} MB)")
        print(f"📝 Max lines per file: {self.max_lines_per_file:,}")
        if self.include_patterns:
            print(f"📁 Including directories: {', '.join(self.include_patterns)}")
        else:
            print(f"📁 Including: ALL files (except excluded directories)")
        print(f"⭐ Always including: package.json, vite.config.ts, tsconfig.*, and {len(self.IMPORTANT_FILENAMES)} other config files")
        print(f"🚫 Excluding: node_modules, .git, __pycache__, and other common excludes")
        
        try:
            with open(self.output_file, 'w', encoding='utf-8') as outfile:
                outfile.write("=" * 80 + "\n")
                outfile.write("COMPLETE PROJECT CODE EXPORT\n")
                outfile.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                outfile.write(f"Project: {self.project_root.name}\n")
                outfile.write(f"Path: {self.project_root}\n")
                outfile.write("=" * 80 + "\n\n")
                
                outfile.write("TABLE OF CONTENTS\n")
                outfile.write("=" * 80 + "\n")
                outfile.write("1. Project Structure (⭐ = important config file)\n")
                outfile.write("2. File Contents\n")
                if include_stats:
                    outfile.write("3. Statistics & Analysis\n")
                outfile.write("\n")
                
                outfile.write("1. PROJECT STRUCTURE\n")
                outfile.write("=" * 80 + "\n\n")
                outfile.write(f"{self.project_root.name}/\n")
                
                tree_lines = self.generate_tree()
                for line in tree_lines:
                    outfile.write(line + "\n")
                
                outfile.write("\n" + "=" * 80 + "\n\n")
                
                if include_structure_only:
                    print(f"✅ Structure exported to: {self.output_file}")
                    return True
                
                outfile.write("2. FILE CONTENTS\n")
                outfile.write("=" * 80 + "\n\n")
                
                # Write export configuration info
                outfile.write("EXPORT CONFIGURATION\n")
                outfile.write("-" * 40 + "\n")
                outfile.write(f"Max file size: {self.max_file_size:,} bytes ({self.max_file_size / 1024 / 1024:.1f} MB)\n")
                outfile.write(f"Max lines per file: {self.max_lines_per_file:,}\n")
                if self.include_patterns:
                    outfile.write(f"Included directories: {', '.join(self.include_patterns)}\n")
                else:
                    outfile.write("Included directories: ALL (except excluded)\n")
                outfile.write("Always included config files (sample):\n")
                for fname in ['package.json', 'vite.config.ts', 'tsconfig.json',
                             'tailwind.config.js', 'next.config.js', 'docker-compose.yml']:
                    outfile.write(f"  ⭐ {fname}\n")
                outfile.write(f"  ... and {len(self.IMPORTANT_FILENAMES) - 6} more config files always included\n")
                if self.truncate_large_files:
                    outfile.write("Truncation: Enabled\n")
                else:
                    outfile.write("Truncation: Disabled\n")
                outfile.write("\n" + "=" * 80 + "\n\n")
                
                files_to_export = []
                for root, dirs, files in os.walk(self.project_root):
                    dirs[:] = [d for d in dirs if d not in self.EXCLUDE_DIRS]
                    import fnmatch
                    filtered_dirs = []
                    for d in dirs:
                        skip = False
                        for exclude_dir in self.EXCLUDE_DIRS:
                            if '*' in exclude_dir and fnmatch.fnmatch(d, exclude_dir):
                                skip = True
                                break
                        if not skip:
                            filtered_dirs.append(d)
                    dirs[:] = filtered_dirs
                    
                    root_path = Path(root)
                    for file in files:
                        file_path = root_path / file
                        if self.should_include_file(file_path):
                            files_to_export.append(file_path)
                
                # Sort with important config files first
                def sort_key(p):
                    is_important = self._matches_important_filename(p.name)
                    return (not is_important, str(p).lower())
                
                files_to_export.sort(key=sort_key)
                total_files = len(files_to_export)
                
                for i, file_path in enumerate(files_to_export, 1):
                    try:
                        relative_path = file_path.relative_to(self.project_root)
                    except ValueError:
                        relative_path = file_path
                    
                    content = self.read_file_content(file_path)
                    if content is None:
                        continue
                    
                    language = self.get_file_language(file_path)
                    file_size = len(content)
                    loc_stats = self._count_lines_of_code(content, language)
                    is_important = self._matches_important_filename(file_path.name)
                    
                    self.file_count += 1
                    self.total_size += file_size
                    self.stats[language] += 1
                    
                    progress = (i / total_files) * 100
                    print(f"\r  Exporting: {progress:.0f}% [{i}/{total_files}]", end='', flush=True)
                    
                    outfile.write(f"\n{'─' * 80}\n")
                    marker = "⭐ CONFIG FILE - " if is_important else ""
                    outfile.write(f"FILE {i}/{total_files}: {marker}{relative_path}\n")
                    outfile.write(f"Language: {language} | Size: {file_size:,} bytes\n")
                    outfile.write(f"Lines: {loc_stats['total']:,} total | ")
                    outfile.write(f"{loc_stats['code']:,} code | ")
                    outfile.write(f"{loc_stats['comment']:,} comments | ")
                    outfile.write(f"{loc_stats['blank']:,} blank\n")
                    
                    if str(file_path) in self.truncated_files:
                        outfile.write("⚠️  NOTE: This file was truncated due to size limits\n")
                    
                    outfile.write(f"{'─' * 80}\n\n")
                    
                    outfile.write(f"```{language}\n")
                    outfile.write(content)
                    if not content.endswith('\n'):
                        outfile.write('\n')
                    outfile.write("```\n\n")
                
                print()
                
                if include_stats:
                    outfile.write("\n3. STATISTICS & ANALYSIS\n")
                    outfile.write("=" * 80 + "\n\n")
                    
                    outfile.write("GENERAL STATISTICS\n")
                    outfile.write("-" * 40 + "\n")
                    outfile.write(f"Total files exported: {self.file_count:,}\n")
                    outfile.write(f"Total size: {self.total_size:,} bytes ")
                    outfile.write(f"({self.total_size / 1024:.2f} KB, ")
                    outfile.write(f"{self.total_size / 1024 / 1024:.2f} MB)\n")
                    outfile.write(f"Average file size: {self.total_size / max(1, self.file_count):,.0f} bytes\n\n")
                    
                    if self.skipped_files:
                        outfile.write("SKIPPED FILES\n")
                        outfile.write("-" * 40 + "\n")
                        outfile.write(f"Total skipped: {len(self.skipped_files)}\n")
                        for skipped in self.skipped_files[:20]:
                            outfile.write(f"  • {skipped}\n")
                        if len(self.skipped_files) > 20:
                            outfile.write(f"  ... and {len(self.skipped_files) - 20} more\n")
                        outfile.write("\n")
                    
                    if self.truncated_files:
                        outfile.write("TRUNCATED FILES\n")
                        outfile.write("-" * 40 + "\n")
                        outfile.write(f"Total truncated: {len(self.truncated_files)}\n")
                        for truncated in self.truncated_files[:20]:
                            outfile.write(f"  • {truncated}\n")
                        if len(self.truncated_files) > 20:
                            outfile.write(f"  ... and {len(self.truncated_files) - 20} more\n")
                        outfile.write("\n")
                    
                    outfile.write("LANGUAGE DISTRIBUTION\n")
                    outfile.write("-" * 40 + "\n")
                    for lang, count in sorted(self.stats.items(), key=lambda x: x[1], reverse=True):
                        percentage = (count / self.file_count) * 100
                        bar = '█' * int(percentage / 2)
                        outfile.write(f"{lang:20} {count:5,} files ({percentage:5.1f}%) {bar}\n")
                    
                    duplicates = self._find_duplicates()
                    if duplicates:
                        outfile.write("\nDUPLICATE FILES DETECTED\n")
                        outfile.write("-" * 40 + "\n")
                        for hash_val, files in list(duplicates.items())[:10]:
                            outfile.write(f"\nHash: {hash_val}\n")
                            for file in files:
                                outfile.write(f"  • {file}\n")
                        if len(duplicates) > 10:
                            outfile.write(f"\n... and {len(duplicates) - 10} more duplicate groups\n")
                        outfile.write(f"\nTotal duplicate groups: {len(duplicates)}\n")
                    
                    outfile.write("\nEXPORT METADATA\n")
                    outfile.write("-" * 40 + "\n")
                    outfile.write(f"Export tool: Complete Project Code Exporter v3.1\n")
                    outfile.write(f"Export date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                    outfile.write(f"Python version: {sys.version}\n")
                    outfile.write(f"Platform: {sys.platform}\n")
                    outfile.write(f"Always-included config files: {len(self.IMPORTANT_FILENAMES)}\n")
                
                outfile.write("\n" + "=" * 80 + "\n")
                outfile.write("END OF EXPORT\n")
                outfile.write("=" * 80 + "\n")
            
            print(f"\n✅ Successfully exported {self.file_count:,} files to: {self.output_file}")
            print(f"📊 Total size: {self.total_size:,} bytes ({self.total_size / 1024 / 1024:.2f} MB)")
            
            if self.skipped_files:
                print(f"⚠️  Skipped {len(self.skipped_files):,} files (too large)")
            if self.truncated_files:
                print(f"⚠️  Truncated {len(self.truncated_files):,} files (size limit)")
            
            print("\n📈 Language Distribution:")
            for lang, count in sorted(self.stats.items(), key=lambda x: x[1], reverse=True)[:10]:
                print(f"  • {lang}: {count:,} files")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Error during export: {str(e)}")
            import traceback
            traceback.print_exc()
            return False


def main():
    parser = argparse.ArgumentParser(
        description='Complete Project Code Exporter - always includes package.json, vite.config.ts, tsconfig.*, and more',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Export everything (config files ALWAYS included)
  python exporter.py -p ./my-project

  # Export with larger limits
  python exporter.py -p ./my-project --max-size 20971520 --max-lines 20000

  # Truncate large files instead of skipping
  python exporter.py -p ./my-project --truncate

  # Exclude specific patterns
  python exporter.py -p ./my-project --exclude "*.test.js,*.spec.ts,docs"

  # Include binary files (base64 encoded)
  python exporter.py -p ./my-project --include-binary

Note: The following files are ALWAYS included regardless of other settings:
  • package.json, package-lock.json, yarn.lock, pnpm-lock.yaml
  • vite.config.ts/js/mjs, vitest.config.*, rollup.config.*, webpack.config.*
  • tsconfig.json, tsconfig.*.json, jsconfig.json
  • All .env* files, Dockerfiles, docker-compose*.yml
  • And 500+ other config files
        """
    )
    
    parser.add_argument('-p', '--project', default='.',
                       help='Project root directory')
    parser.add_argument('-o', '--output', default=None,
                       help='Output filename')
    parser.add_argument('--structure-only', action='store_true',
                       help='Only export tree structure')
    parser.add_argument('--no-stats', action='store_true',
                       help='Do not include statistics')
    parser.add_argument('--max-size', type=int, default=5 * 1024 * 1024,
                       help='Maximum file size in bytes (default: 5MB)')
    parser.add_argument('--max-lines', type=int, default=5000,
                       help='Maximum lines per file (default: 5000)')
    parser.add_argument('--include', default='',
                       help='Comma-separated directories to include (default: all)')
    parser.add_argument('--exclude', default='',
                       help='Comma-separated patterns to exclude')
    parser.add_argument('--truncate', action='store_true',
                       help='Truncate large files instead of skipping them')
    parser.add_argument('--include-binary', action='store_true',
                       help='Include binary files (base64 encoded)')
    parser.add_argument('--max-depth', type=int, default=15,
                       help='Maximum tree depth (default: 15)')
    
    args = parser.parse_args()
    
    include_patterns = [p.strip() for p in args.include.split(',') if p.strip()]
    exclude_patterns = [p.strip() for p in args.exclude.split(',') if p.strip()]
    
    exporter = AdvancedProjectExporter(
        project_root=args.project,
        output_file=args.output,
        max_file_size=args.max_size,
        max_lines_per_file=args.max_lines,
        include_patterns=include_patterns,
        exclude_patterns=exclude_patterns,
        truncate_large_files=args.truncate,
        include_binary=args.include_binary
    )
    
    success = exporter.export(
        include_structure_only=args.structure_only,
        include_stats=not args.no_stats
    )
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()