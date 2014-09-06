'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var rimraf = require('rimraf');


var NgsGenerator = module.exports = function NgsGenerator(args, options) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({
            skipInstall: options['skip-install']
        });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    // Loads generator settings.
    this.defaultConfig = JSON.parse(
        this.readFileAsString(path.join(__dirname, 'config.json'))
    );
};

util.inherits(NgsGenerator, yeoman.generators.Base);

NgsGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [{
        name: 'projectName',
        message: 'What do you want to call your project?'
    }, {
        type: 'confirm',
        name: 'useBackbone',
        message: 'Would you like to include Backbone.js?',
        default: this.defaultConfig.useBackbone
    }, {
        type: 'confirm',
        name: 'useRequire',
        message: 'Would you like to include RequireJS (for AMD support)?',
        default: this.defaultConfig.useRequire
    }];

    this.prompt(prompts, function (props) {
        for (var propName in props) {
            this.config.set(propName, props[propName]);
        }
        cb();
    }.bind(this));
};

NgsGenerator.prototype.askForPreprocessors = function askForPreprocessors() {
    var cb = this.async();

    var prompts = [{
        name: 'cssPre',
        type: 'list',
        message: 'Will you be using a CSS preprocessor?',
        choices: this.defaultConfig.cssPreChoices,
        default: this.defaultConfig.cssPreDefChoice
    }, {
        name: 'autoPre',
        type: 'confirm',
        message: 'Use the Autoprefixer for your CSS?',
        default: this.defaultConfig.autoPre
    }, {
        name: 'jsPre',
        type: 'list',
        message: 'How about a Javascript preprocessor? We like Coffeescript.',
        choices: this.defaultConfig.jsPreChoices,
        default: this.defaultConfig.jsPreDefChoice
    }];

    this.prompt(prompts, function (props) {
        for (var propName in props) {
            this.config.set(propName, props[propName]);
        }
        cb();
    }.bind(this));
};

// Begin Generating App/UI
NgsGenerator.prototype.app = function app() {
    this.context = this.config.getAll();
    this.mkdir(this.defaultConfig.templatesDir);
    this.mkdir(this.defaultConfig.javascriptsDir);
    this.mkdir(this.defaultConfig.stylesheetsDir);

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
};

NgsGenerator.prototype.preprocessors = function preprocessors() {
    if (this.config.get('cssPre')) { this.mkdir(this.defaultConfig.scssDir); }
    if (this.config.get('jsPre')) { this.mkdir(this.defaultConfig.coffeescriptDir); }
};

NgsGenerator.prototype.git = function git() {
    this.template('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
};

// adding opinionated project settings
NgsGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('csslintrc', '.csslintrc');
    this.copy('bowerrc', '.bowerrc');
    // We're copying over all the default tasks used by load-grunt-config
    this.directory('_grunt', 'grunt');
};

NgsGenerator.prototype.gruntCleanup = function gruntCleanup() {
    // We're going to cleanup any tasks not needed
    var cb = this.async();

    if (!this.config.get('cssPre')) {
        // this.copy('_grunt/compass.coffee', 'grunt/compass.coffee');
        rimraf('grunt/compass.coffee', function () {
            console.log('Removing Compass task');
        });
    }

    if (!this.config.get('autoPre')) {
        // this.copy('_grunt/compass.coffee', 'grunt/compass.coffee');
        rimraf('grunt/autoprefixer.coffee', function () {
            console.log('Removing Autoprefixer task');
        });
    }

    if (!this.config.get('jsPre')) {
        rimraf('grunt/coffeelint.coffee', function () {
            console.log('Removing Coffeelint task');
        });

        rimraf('grunt/coffee.coffee', function () {
            console.log('Removing Coffee task');

        });
    }
    cb();
};

NgsGenerator.prototype.gruntfile = function gruntfile() {
    // Finish off by just moving the Grunt file over
    this.copy('Gruntfile.coffee');
};
