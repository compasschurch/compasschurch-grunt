module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    
    grunt.initConfig({
        bump: {
          options: {
            commitMessage: 'chore: Release v%VERSION%',
            commitFiles: ['-a'], // '-a' for all files
            pushTo: 'origin'
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
};