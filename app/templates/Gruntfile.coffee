'use strict'
module.exports = (grunt) ->
    # measures the time each task takes
    require('time-grunt') grunt

    # load all grunt tasks using load-grunt-config
    # this assumes grunt-contrib-watch, grunt-contrib-coffee,
    # grunt-coffeelint, grunt-contrib-clean, grunt-contrib-uglify is in the package.json file
    require('load-grunt-config') grunt

    grunt.initConfig
        # load in the module information
        pkg: grunt.file.readJSON 'package.json'
        # path to Grunt file for exclusion
        gruntfile: 'Gruntfile.coffee'
        # generalize the module information for banner output
        banner: '/**\n' +
                        ' * NGS Project: <%= pkg.name %> - v<%= pkg.version %>\n' +
                        ' * Description: <%= pkg.description %>\n' +
                        ' * Date Built: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        ' * Copyright (c) <%= grunt.template.today("yyyy") %>' +
                        '  | <%= pkg.author.name %>;\n' +
                        '**/\n'

        ## TODO: we need to add tests to start in all modules
