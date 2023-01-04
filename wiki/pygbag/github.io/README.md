



How to deploy your game on github pages

First you need this yml file:

![2023-01-03 (1)](https://user-images.githubusercontent.com/113060021/210572009-a8d2babd-1c15-4ea9-9340-0861bbc4f2c9.png)

Put it in your main repository. Once it's there you should be able to go to the action tab in your repo and run the pygbag action.

![2023-01-03 (4)](https://user-images.githubusercontent.com/113060021/210572519-d6b1b465-7350-4b40-a867-2d66e3a6aca7.png)

This will create a gh-pages repository with all the build files for your game. Next, go to settings and under Code and automation, click on pages. Set your branch to be built from to gh-pages.

![2023-01-03 (6)](https://user-images.githubusercontent.com/113060021/210572805-7fb58ab5-202c-4d02-a70e-1bdcc18858b4.png)

Finally go back to actions a run the pages-build-deployment action and your game will be published to username.github.io/repo-name/.










[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygbag/github.io/README.md)
