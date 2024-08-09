
# *Uploading your game on itch.io*

For others to be able to play your game online, you need to publish it since pygbag is not ( and should not be) reachable from outside your local network. Itch.io allows you to do that and more.

### Zipping the files
To upload you website to itch.io you would need to zip its source code and upload it to itch.io

Use `python3 -m pygbag --archive the/game/folder/main.py` and get the web.zip from ./build/web.zip in the game folder
or :
1. go inside your game folder
2. go inside the build folder
3. go inside the web folder
4. then select the contents inside the folder
5. zip those contents


### Uploading to itch.io

To set up the project:

1. Create a new project.
2. Select the **HTML** Kind of project.
3. Upload the web.zip you got ealier via the upload interface of the project.
4. Select `This file will be played in the browser`
5. Then save your project

After following these step, if you view your game page and set it to public, then you would be able to see your game.

Thought, if your are unable to do so, you can ask for help in the [pygame discord server](https://discord.gg/s6Hhrh77aq)



[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygbag/itch.io/README.md)
