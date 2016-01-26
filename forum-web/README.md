##Setup Using NPM, Bower & Gulp
___

Assuming you have Node installed:

###Dev Dependencies (Gulp)
___

1) From command line in project root directory: **npm install**

###Library Dependencies
___

2) If you do not already have Bower: **npm install -g bower**

3) Install bower dependencies: **bower install**

###Gulp Tasks
___

4) See gulpfile.js in the root directory for list of defined gulp tasks.

5) Run a gulp task from the command line: **gulp [taskname]**

6) Gulp task output will appear in the **dist/** directory

7) Both of the commands **gulp** and **gulp watch** will start the 'watch' task, which monitors changes in css/, js/pre/, and js/post/ directories and runs the appropriate task to rebuild the dist/ files. While developing, run this task and let it run in the background while you are working/making changes.

8) 'build-lint' task will rebuild the entire dist/ directory and output the results of jshint on the js/ files to the command line. This task depends on newly added gulp plugins, so run **npm install** again before running this task.

