



How to deploy your game on github pages

First you need this yml file:

[Download pygbag.yml](pygbag.yml)

**Note this file must be in the folder `.github/workflows/`, regardless of the repository's name**

It should look like this once in your repo :

![2023-01-03 (1)](yml.png)

Put it in your main branch. Once it's there, you should be able to go to the "Actions" tab in your repo and run the pygbag action.

![2023-01-03 (4)](actions.png)

This will create a gh-pages branch with all the build files for your game. If this step fails, go to "Settings" and under "Code and automation", click on "Actions" to double check "Workflow permissions" is properly set to "Read and write permissions" (as below):

![image](https://user-images.githubusercontent.com/37024974/230336561-502cc7ff-37ab-48e9-bae3-b582e7cef8ae.png)

Next, go to "Settings" and under "Code and automation", click on "Pages". Set your branch to be built from "gh-pages".

![2023-01-03 (6)](pages.png)

Finally, go back to "Actions" and run the "pages-build-deployment" action. Now your game will be published to username.github.io/repo-name/.











