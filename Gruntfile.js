module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    
    grunt.initConfig({
        bump: {
          options: {
            commitMessage: 'chore: Release v%VERSION%',
            commitFiles: '-a', // '-a' for all files
            pushTo: 'origin'
          }
        }
    });
    
    grunt.registerTask('release', [
        'bump-only',
        'changelog',
        'bump-commit'
    ]);
};