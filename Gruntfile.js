'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist',
        nginx: 'conf/nginx'
    };

    grunt.initConfig({

        yeoman: appConfig,

        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            express: {
                files: ['./{,*/}*.js', '<%= yeoman.app %>/index.html', '<%= yeoman.app %>/{,*/}*.html'],
                tasks: ['express:dev'],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            js: {
                files: ['<%= yeoman.app %>/{,*/}*.js', './bower_components/{,/*}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/{,*/}*.html'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            }
        },

        express: {
            options: {
                node_env: 'development',
                background: false
            },
            dev: {
                options: {
                    script: './agent.js',
                    node_env: 'development'
                }
            },
            pro: {
                options: {
                    script: './agent.js',
                    node_env: 'production'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/{,*/}*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/{,*/}*',
                        '!<%= yeoman.dist %>/.git{,*/}*'
                    ]
                }]
            },
            server: '.tmp',
            agent: [
                '<%= yeoman.app %>/release',
                '<%= yeoman.app %>/{,*/}/{,*/}*annotated.js',
                '<%= yeoman.app %>/{,*/}/{,*/}*.min.css',
                '<%= yeoman.dist %>/{,*/}/{,*/}*annotated.js',
                'bower_components/{,*/}/{,*/}*annotated.js'
            ]
        },

        wiredep: {
            dev: {
                src: ['<%= yeoman.app %>/index.html'],
                fileTypes: {
                    html: {
                        replace: {
                            js: '<script src="lib/{{filePath}}"></script>',
                            css: '<link rel="stylesheet" href="lib/{{filePath}}" />'
                        }
                    }
                },
                options: {
                    directory: 'bower_components',
                    bowerJson: 'bower.json',
                    dependencies: true,    // default: true
                    devDependencies: true, // default: false
                    includeSelf: true,     // default: false

                    onError: function (err) {
                        console.log("error in grunt wiredep " + err);
                    },

                    onFileUpdated: function (filePath) {
                        console.log("wiredep file updated " + filePath);
                    },

                    onPathInjected: function (fileObject) {
                        console.log("wiredep path injected " + fileObject);
                    },

                    onMainNotFound: function (pkg) {
                        console.log("wiredep main not found " + pkg);
                    }
                }
            },
            pro: {
                src: ['<%= yeoman.app %>/index.html'],
                fileTypes: {
                    html: {
                        replace: {
                            js: '<script src="lib/{{filePath}}"></script>',
                            css: '<link rel="stylesheet" href="lib/{{filePath}}" />'
                        }
                    }
                },
                options: {
                    directory: '<%= yeoman.dist %>',
                    bowerJson: 'bower.json'
                }
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },

        //bower install to get angular js project ready
        bower: {
            install: {
                options: {
                    //does not care with .bowerrc file
                    //move bower component and bower.json to parent project directory
                    targetDir: "bower_components"
                }
            }
        },

        uglify: {
            options: {
                report: 'min',
                mangle: false
            },
            agent: {
                files: {
                    '<%= yeoman.dist %>/agent/js/agent.min.js': ['dist/agent.annotated.js']
                }
            }
        },

        copy: {
            devlibs: {
                expand: true,
                cwd: '<%= yeoman.app %>',
                src: ['**/*.js'],
                dest: '<%= yeoman.dist %>/agent/dev/js/'
            },
            views: {
                expand: true,
                cwd: '<%= yeoman.app %>',
                src: ['**/*.html', '**/*.htm', '**/*robots.ico'],
                dest: '<%= yeoman.dist %>/agent/views'
            },
            deployAgentForProduction: {
              expand : true,
              cwd : '<%= yeoman.dist%>/agent',
              src : ['**/*.*'],
              dest: '/var/www/agent/'
            },
            nginx: {
              expand: true,
              cwd: appConfig.nginx,
              src:  ['**/*.conf'],
              dest: '/etc/nginx/conf.d/'
            },
        },

        ngAnnotate: {
            options: {
                singleQuotes: true,
                add: true
            },
            agent: {
                files: [
                    {
                        expand: true,
                        src: ['<%= yeoman.app %>/{,*/}/{,*/}*.js'],
                        ext: '.annotated.js', // Dest filepaths will have this extension.
                        extDot: 'last'       // Extensions in filenames begin after the last dot
                    }
                ]
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            agentJS: {
                src: ['<%= yeoman.app %>/{,*/}/{,*/}*annotated.js'],
                dest: '<%= yeoman.dist %>/agent.annotated.js'
            }
        },
        purifycss: {
            options: {
                separateFiles: true,
                prefix:'',
                flatten: true
            },
            agent: {
                src: ['<%= yeoman.dist %>/{,*/}/{,*/}/{,*/}/{,*/}*.html',
                    '<%= yeoman.dist %>/{,*/}/{,*/}/{,*/}/{,*/}*.js'],
                css: ['<%= yeoman.dist %>/{,*/}/{,*/}/{,*/}/{,*/}*.css'],
                dest: '<%= yeoman.dist %>/purify/'
            }
        },
        replace: {
            agentDevResourcesHost: {
              src: ['<%= yeoman.dist %>/agent/**/*.*'],
              overwrite: true,                 // overwrite matched source files
              replacements: [{
                from: "https://cdn.ubicall.com/static/",
                to: "https://cdn.dev.ubicall.com/static/"
              },{
                from: "https://cdn.ubicall.com/agent/",
                to: "https://cdn.dev.ubicall.com/agent/"
              },{
                from: "https://agent.ubicall.com/",
                to: "https://agent.dev.ubicall.com/"
              },{
                from: "https://api.ubicall.com",
                to: "https://api.dev.ubicall.com"
              },{
                from: "<!-- Production Mode-->",
                to: "<!-- Production Mode"
              },{
                from: "<!-- Development Mode-->",
                to: "<!-- Development Mode-->"
              }]
            },
            agentProdResourcesHost: {
              src: ['<%= yeoman.dist %>/agent/**/*.*'],
              overwrite: true,                 // overwrite matched source files
              replacements: [{
                    from: "<!-- Production Mode-->",
                    to: "<!-- Production Mode-->"
              },{
                    from: "<!-- Development Mode-->",
                    to: "<!-- Development Mode"
              }]
            }
        }
    });


    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-purifycss');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-nginx');


    grunt.registerTask('preserve', 'Compile then start a connect web server', [
        'clean',
        //'wiredep:dev',
        'clean:agent',
        'copy:devlibs',
        'copy:views',
        'replace:agentDevResourcesHost',
        'copy:nginx',
        'nginx:restart',
        'copy:deployAgentForProduction'
    ]);

    grunt.registerTask('serve', 'Compile then start a connect web server', [
        'preserve',
        'express:dev',
        'watch'
    ]);

    grunt.registerTask('test', 'Clean then run test cases', [
        'clean',
        'bower:install',
        //'wiredep',
        'karma'
    ]);

    grunt.registerTask('prebuild', 'Clean then build to dist', [
        'clean',
        'ngAnnotate:agent',
        'concat:agentJS',
        'uglify:agent',
        'clean:agent',
        'copy:views',
        'replace:agentProdResourcesHost',
        'copy:nginx',
        'nginx:restart',
        'copy:deployAgentForProduction'
    ]);
    grunt.registerTask('build', 'Clean then build to dist', [
        'prebuild',
        // 'wiredep:pro',
        'express:pro',
        'watch'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
