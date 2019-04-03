module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},
		concat: {
			dist: {
				options: {
					banner: "<%= meta.banner %>"
				},
				files: {
					"dist/jquery.calmosaic.js": "src/jquery.calmosaic.js",
					"dist/jquery.calmosaic.css": "dist/jquery.calmosaic.css",
					"dist/jquery.calmosaic.min.css": "dist/jquery.calmosaic.min.css"
				}
			}
		},
		uglify: {
			dist: {
				src: ["dist/jquery.calmosaic.js"],
				dest: "dist/jquery.calmosaic.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},
		less: {
			production: {
				files: {
					"dist/jquery.calmosaic.css": "src/jquery.calmosaic.less"
				}
			}
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					"dist/jquery.calmosaic.min.css": "dist/jquery.calmosaic.css"
				}
			}
		},
		devserver: {
			base: "./demo"
		},
		watch: {
			files: ["src/*"],
			tasks: ["build"]
		},
		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			dev: {
				tasks: ["build", "devserver", "watch"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-devserver");
	grunt.loadNpmTasks("grunt-concurrent");

	grunt.registerTask("build", ["less", "cssmin", "concat", "uglify"]);
	grunt.registerTask("default", ["build"]);
	grunt.registerTask("dev", ['concurrent:dev']);

}
