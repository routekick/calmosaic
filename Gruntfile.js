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
					"dist/jquery.CalendarHeatmap.js": "src/jquery.CalendarHeatmap.js",
					"dist/jquery.CalendarHeatmap.css": "dist/jquery.CalendarHeatmap.css",
					"dist/jquery.CalendarHeatmap.min.css": "dist/jquery.CalendarHeatmap.min.css"
				}
			}
		},
		uglify: {
			dist: {
				src: ["dist/jquery.CalendarHeatmap.js"],
				dest: "dist/jquery.CalendarHeatmap.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},
		less: {
			production: {
				files: {
					"dist/jquery.CalendarHeatmap.css": "src/jquery.CalendarHeatmap.less"
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
					"dist/jquery.CalendarHeatmap.min.css": "dist/jquery.CalendarHeatmap.css"
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
				tasks: ["devserver", "watch"]
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
