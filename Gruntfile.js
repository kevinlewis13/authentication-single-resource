'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    jshint: {
      dev: {
        src: ['Gruntfile.js', 'models/**/*.js', 'routes/**/*.js', 'test/**/*.js']
      },
      options: {
        jshintrc: true
      }
    },

    simplemocha: {
      dev: {
        src: ['test/**/*.js']
      }
    },

    watch: {
      files: ['<%= jshint.dev.src %>']
    }

  });

  grunt.registerTask('linter', ['jshint:dev']);
  grunt.registerTask('tester', ['simplemocha:dev']);
  grunt.registerTask('test_suite', ['linter', 'tester']);

};
