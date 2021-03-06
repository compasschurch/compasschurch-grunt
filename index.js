var timeGrunt = require('time-grunt');
var jshintStylish = require('jshint-stylish');

module.exports = function (grunt) {
    // load all grunt tasks (NB: Can't naively use load-grunt-tasks)
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-cssbeautifier');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-manifest-ext');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-targethtml');

    // show elapsed time at the end
    timeGrunt(grunt);
    
    var profile = grunt.option('profile') || 'local';

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
            src: 'src',
            srcdest: '<%= yeoman.dist %>/<%= yeoman.assets %>/<%= pkg.volo.namespace %>',
            app: 'app',
            dist: 'dist',
            assets: 'assets',
            vendors: 'vendors',
        },
        clean: ['<%= yeoman.dist %>'],
        watch: {
            'default': {
                files: [
                    '<%= yeoman.src %>/**/*',
                    '<%= yeoman.app %>/**/*',
                    'package.json',
                    'profiles.local.json'
                ],
                tasks: ['default'],
                options: {
                    atBegin: true
                }
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
                '<%= yeoman.app %>/{,**/}*.js',
                '<%= yeoman.src %>/{,**/}*.js',
            ]
        },
        jsbeautifier: {
            "default": {
                src: [
                    "<%= yeoman.app %>/{,**/}*.{html,css,js}",
                    "<%= yeoman.src %>/{,**/}*.{html,css,js}",
                ]
            }
        },
        cssbeautifier: {
            options: {
                indent: '\t',
                autosemicolon: true
            },
            'default': [
                "<%= yeoman.app %>/{,**/}*.css",
                "<%= yeoman.src %>/{,**/}*.css",
            ]
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
                    dest: '<%= yeoman.srcdest %>'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>',
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
                    dest: '<%= yeoman.srcdest %>'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>',
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
                    dest: '<%= yeoman.srcdest %>'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>',
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
                    dest: '<%= yeoman.srcdest %>'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>',
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
                    dest: '<%= yeoman.srcdest %>',
                    src: ['{,**/}*']
                }, {
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>/',
                    dest: '<%= yeoman.dist %>/',
                    src: ['{,**/}*']
                }]
            }
        },
        jsonlint: {
            'default': {
                src: [
                    '*.json',
                    // Don't want to lint the vendors dir
                    '<%= yeoman.src %>/{,**/}*.json',
                    '<%= yeoman.app %>/{,**/}*.json'
                ]
            }
        },
        targethtml: {
            'default': {
                options: {
                    curlyTags: profiles[profile]
                },
                files: {
                    '<%= yeoman.dist %>/index.html': '<%= yeoman.app %>/index.html'
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
                    'api/{,**/}*', // This shouldn't be necessary...
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
                    master: '../<%= yeoman.dist %>/index.html'
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
        },
        bump: {
          options: {
            commitMessage: 'chore: Release v%VERSION%',
            commitFiles: ['-a'], // '-a' for all files
            push: false
          }
        }
    });
    
    grunt.registerTask('release:patch', [
        'bump-only:patch',
        'changelog',
        'bump-commit'
    ]);

    grunt.registerTask('release:minor', [
        'bump-only:minor',
        'changelog',
        'bump-commit'
    ]);

    grunt.registerTask('release:major', [
        'bump-only:major',
        'changelog',
        'bump-commit'
    ]);


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
    
    grunt.registerTask('writeprofile', function() {
        var profile = grunt.config.get('profile');
        var yo = grunt.config.get('yeoman');
        
        grunt.file.write(yo.dist + '/' + yo.assets + '/profile.json', JSON.stringify(profile));
    });
    
    grunt.registerTask('default', [
        'copy',
        'targethtml',
        'manifest:' + (profile == 'local' ? 'local' : 'default'),
        'writeprofile',
    ]);
};
