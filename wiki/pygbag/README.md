# Pygbag Wiki
Hey there, welcome to the Pygbag Wiki!

This page covers installing Pygbag, using it to package your game, and uploading it to be played by anyone on the Internet.

If you have questions at any point, you can ask for help in [Pygame's Discord Server](https://discord.gg/s6Hhrh77aq).

## Installation
Pip is a tool used to install Python libraries, and it's usually installed along with Python. 

Execute the following command in the terminal:
`pip install git+https://github.com/pygame-web/pygbag --user --upgrade`.<br>
This would install/upgrade to the latest version of pygbag.

`pip install pygbag --user --upgrade` also works.

## Web Testing
When packaging, Pygbag sets up a local server which runs your game and provides debug information. This is only accessible from your own computer. If you do not need to debug your game, add `--build` to the command line options.

### Creating a project
Create a folder. This folder will include all your game files.

Now, create `main.py` inside that folder and paste this code into it.

```py
import asyncio
import pygame

pygame.init()
pygame.display.set_mode((320, 240))
clock = pygame.time.Clock()


async def main():
    count = 60

    while True:
        print(f"{count}: Hello from Pygame")
        pygame.display.update()
        await asyncio.sleep(0)  # You must include this statement in your main loop. Keep the argument at 0.

        if not count:
            pygame.quit()
            return
        
        count -= 1
        clock.tick(60)

asyncio.run(main())
```
This is some test code to check if Pygbag is running correctly.

### Running your packaged project in your own browser
On the command line, navigate to the parent directory of your project. (that is, the directory which holds it)

Run this command: `pygbag folder_name` (replace folder_name with the name that you gave your game folder)

If `pygbag` isn't recognised as a command, you can run `python -m pygbag folder_name` as an alternative.

After running this command, navigate to [localhost:8000#debug](https://localhost:8000#debug). The browser should show a page like this: 
![image](https://user-images.githubusercontent.com/78538391/169882643-a93622e2-99fe-4f71-90ed-017ab2da51c6.png)

So, you might be wondering how players will play your game if your game window is so small and the debug console takes up so much space. The answer is that you can navigate to [localhost:8000](https://localhost:8000/) instead to hide the debug console.

If you were able to complete this step, congratulations! You have successfully set up Pygbag and tested that your game runs in the browser!

## Templates
You can change the page layout (and much more) using templates. They consist of HTML markup and Python/JavaScript code to contain your packaged game, plus some CSS to style it. To make your template better fit your game, you may want change it from the default one. Add `--template [TEMPLATE NAME].tmpl` to Pygbag's arguments when running it from the command line to set the template it uses.

### Using built-in templates
This is recommended if you don't want to edit HTML. Check [/static](https://github.com/pygame-web/pygbag/tree/main/static) in Pygbag's repository for a list of available templates. Put the filename after `--template` to make Pygbag use it. <!--Not sure where the templates are hosted exactly, made my best guess. Correct me if I'm wrong.-->

### Downloading a template and customising it
[Here](https://github.com/pygame-web/pygbag/tree/main/static) you can find various templates available online. The simplest way to customise a template is to download one and edit them.

If you want to make Pygbag use a template on your computer, pass the full path of your template file instead of just the filename. Running Pygbag in this way will package your game with your desired template without erasing the cache.

With this approach, you can customize the template as you like, and test out changes before you publish your game. 

> Before editing templates, you should have a good knowledge of HTML. The code in templates is important to running the game properly, so edit them carefully. Remember to test that your game still packages correctly after switching/editing templates.

## Project Structure

### Assets
Assets are the images, fonts and sounds your game uses. If you aren't using Pygbag, you can place the assets in any folder (although it's good practice to put them in your project folder anyways). With Pygbag, you must place all your assets in your project folder, or they will not be packaged.

### Other libraries
Most libraries can be used normally, but certain complex ones (e.g. numpy, matplotlib) need to be imported at the top of `main.py`.

### Code
You won't need to change much of your project's code to make it compatiable with Pygbag:

1. Add `import asyncio` to the script containing your game loop.
2. Encapsulate your variable declarations (other than the window, as other functions might use it too)
3. Put the game loop inside `main()`. It must be an asynchronous function (use `async def` instead of `def`).
3. Put `await asyncio.sleep(0)` in your game loop.
4. Put `asyncio.run(main())` at the end of the file. The game loop will be run here, so any additional lines will not be run.

## Hosting your game on itch.io (Optional)
To let others play your game online, you must publish your game on a publicly accessible website. [itch.io](https://itch.io) offers free hosting and allows you to customise your game page.

### Zipping
To host your game on itch.io, you need to zip the bundle created by Pygbag and upload it. Use the `--archive` option if you want Pygbag to produce a ZIP file. This will be located at `PROJECT_DIR/build/web.zip`

### Uploading
1. [Create a new project](https://itch.io/game/new)
2. Set `Kind of project` to `HTML`
3. Fill in other project parameters
4. Upload the .zip file to the page
5. Tick `This file will be played in the browser` on the upload
6. Save your project

More information can be found [here](https://itch.io/docs/creators/html5). After following these steps, if you view your game page, you would be able to see your game. If you update your games frequently, you can use [butler](https://itch.io/docs/butler/), a command-line tool made by the developers of itch.

## Conclusion
Congratulations! You were able to finish this tutorial on pygbag, now you can go ahead and try to make all your games available in the web too!!<br>
Thank you for following along!

[Spotted a mistake? Contribute to this page.](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygbag/README.md)
