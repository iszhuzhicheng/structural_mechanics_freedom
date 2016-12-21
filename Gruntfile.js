module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      development:{
        options:{
          compress:true
        },
        files: {
          'main.css':'dev/index.less'
        }
      }
    },
    pug: {
      development:{
        files: {
          'index.html': 'dev/index.pug'
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          './main.js': ['./bower_components/jquery/dist/jquery.min.js',
          './bower_components/underscore/underscore-min.js',
          './bower_components/EaselJS/lib/easeljs-0.8.2.min.js',
          './bower_components/model/dist/model.js',
          './dev/js/pubsubz.js',
          './dev/js/factory/*.js',
          './dev/js/lib/*.js',
          './dev/js/model/*.js',
          './dev/js/decorator/*.js',
          './dev/js/view/*.js',
          './dev/js/controller/*.js',
          './dev/js/app.js'
          ]
        }
      }
    },
    watch: {
      gruntfile:{
        files: [ 'Gruntfile.js'],
        options: {
          reload: true
        }
      },
      pug:{
        files: ['./dev/*.pug','./dev/_includes/**/*.pug'],
        tasks: ['pug']
      },
      less:{
        files: ['./dev/*.less','./dev/_includes/**/*.less'],
        tasks: ['less']
      },
      static:{
        files: ['./dev/data.json'],
        tasks: ['pug']
      },
      uglify:{
        files: ['./dev/js/*.js','./dev/js/**/*.js'],
        tasks: ['uglify']
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['pug','less','uglify','watch'])
  grunt.registerTask('build', ['pug','less','uglify','watch'])
};
