var loadGruntTasks = require('load-grunt-tasks');
var timeGrunt = require('time-grunt');
var jshintStylish = require('jshint-stylish');

module.exports = function (grunt) {
    // load all grunt tasks
    loadGruntTasks(grunt);
    // show elapsed time at the end
    timeGrunt(grunt);
    
    grunt.option.init({
        'profile': 'local'
    });
    
    var profile = grunt.option('profile');

    var pkg = grunt.file.readJSON('package.json');
    var profiles = pkg.profiles || {};
    if (grunt.file.exists('profiles.local.json')) {
        profiles.local = grunt.file.readJSON('profiles.local.json');
    }
    
    grunt.initConfig({
        pkg: pkg,
        profile: profiles[profile],
        server: {
            port: process.env.PORT,
            host: process.env.IP
        },
        yeoman: {
            src: 'app',
            dist: 'dist',
            assets: 'assets',
            vendors: 'vendors',
        },
        clean: ['<%= yeoman.dist %>'],
        watch: {
            'default': {
                files: ['{,**/}*'],
                tasks: [
                    'newer:copy',
                    'newer:targethtml',
                ]
            }
        },
        jshint: {
            options: {
                force: true,
                jshintrc: '.jshintrc',
                reporter: jshintStylish
            },
            // We only care about making source files pretty
            'default': [
                'Gruntfile.js',
                '<%= yeoman.src %>/**/*.js',
            ]
        },
        jsbeautifier: {
            "default": {
                src: ["<%= yeoman.src %>/**/*.{html,css,js}"]
            }
        },
        cssbeautifier: {
            options: {
                indent: '\t',
                autosemicolon: true
            },
            'default': ["<%= yeoman.src %>/{,**/}*.css"]
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            'default': {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.src %>',
                    src: '{,**/}*.css',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        imagemin: {
            'default': {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.src %>',
                    src: '{,**/}*.{gif,jpeg,jpg,png,webp}',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        svgmin: {
            'default': {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.src %>',
                    src: '{,**/}*.svg',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        htmlmin: {
            'default': {
                options: {
                    removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.src %>',
                    src: '**/*.{ng,html}',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        
        // Merge all files into standard AMD structure
        // so we don't need to ship a huge requirejs.config to the browser
        copy: {
            'default': {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.vendors %>/',
                    dest: '<%= yeoman.dist %>/',
                    src: ['{,**/}*']
                }, {
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.src %>/',
                    dest: '<%= yeoman.dist %>/',
                    src: ['{,**/}*']
                }]
            }
        },
        jsonlint: {
            'default': {
                src: [
                    '*.json',
                    '<%= yeoman.src %>/{,**/}*.json',
                ]
            }
        },
        targethtml: {
            'default': {
                options: {
                    curlyTags: {
                        baseUrl: "<%= profile.baseUrl %>"
                    }
                },
                files: {
                    '<%= yeoman.dist %>/index.html': '<%= yeoman.src %>/index.html'
                }
            }
        },
        manifest: {
            options: {
                network: ['*', 'http://*', 'https://*'],
                preferOnline: false,
                verbose: true,
                timestamp: false,
                hash: true,
                exclude: [
                    'robots.txt',
                    'api/{,**/}*',
                    '.*',
                    '{,**/}*.appcache'
                ],
            },
            'default': {
                options: {
                    basePath: '<%= yeoman.dist %>/',
                    master: 'index.html'
                },
                src: [
                    '{,**/}*',
                ],
                dest: '<%= yeoman.dist %>/index.appcache'
            },
            local: {
                options: {
                    basePath: '<%= yeoman.vendors %>/',
                    master: '../<%= yeoman.src %>/index.html'
                },
                src: [
                    '{,**/}*',
                ],
                dest: '<%= yeoman.dist %>/index.appcache'
            }
        },
        requirejs: {
            'default': {
                options: {
                    baseUrl: "<%= yeoman.dist %>/<%= yeoman.assets %>",
                    waitSeconds: 30,
                    optimize: "uglify2",
                    uglify2: {
                        angular: true
                    },
                    name: "main",     
                    out: "<%= yeoman.dist %>/<%= yeoman.assets %>/main.js",
                    done: function(done, output) {
                        var duplicates = require('rjs-build-analysis').duplicates(output);
                        
                        if (duplicates.length > 0) {
                            grunt.log.subhead('Duplicates found in requirejs build:');
                            grunt.log.warn(duplicates);
                            done(new Error('r.js built duplicate modules, please check the excludes option.'));
                        }
                        
                        done();
                    }
                }
            }
        }
    });

    grunt.registerTask('test', [
        
    ]);

    grunt.registerTask('beautify', [
        'jsbeautifier',
        'cssbeautifier',
    ]);

    grunt.registerTask('lint', [
        'jsonlint',
        'jshint',
    ]);

    grunt.registerTask('travis', [
        'lint',
        'test',
    ]);

    grunt.registerTask('precommit', [
        'beautify',
        'lint',
        'test',
    ]);
    
    grunt.registerTask('default', [
        'copy',
        'targethtml',
        'manifest:' + (profile == 'local' ? 'local' : 'default'),
    ]);
};
