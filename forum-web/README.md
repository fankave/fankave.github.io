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
___


##Embedding Live Chat in a Website
___

###Simple Embed (Fixed Size)
___

Add the following snippet to your html where you want to load the Live Chat experience. Adjust the channel by changing the end of the url following `src`. Adjust the width and height of the frame by changing the appropriate value.

`<iframe src="http://was.fankave.com/forum/#/channel/1346" width="375px" height="627px" frameborder="0"></iframe>`


###Responsive Embed
___

1) Add the following block of code to the website's `<head>` element. To customize the channel that is embedded, simply change the end of the url following `iframe.src`

```
<script type='text/javascript' charset='utf-8'>     
  var iframe = document.createElement('iframe');       
  document.getElementById('fankave-live-chat').appendChild(iframe);

  iframe.src = "http://was.fankave.com/forum/#/channel/1346";       
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameborder = "0";
</script>
```

2) Insert the following element in your html where you want the Live Chat experience to be loaded. Using CSS, you can style this container element to your liking and the Live Chat will fill the container (make sure to set an explicit height).

`<div id="fankave-live-chat"></div>`

