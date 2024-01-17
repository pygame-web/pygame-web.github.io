# Pygbag Wiki
Hey there, welcome to the Pygbag Wiki!

This page covers installing Pygbag, using it to package your game, and uploading it to be played by anyone on the Internet.

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
> If the page doesn't load, try the previous steps again. If it still does not package your game correctly, you can join the [Pygame's discord server](https://discord.gg/653AkjMd) to ask for help.

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

## Project Setup

### Use assets
Assets are essentially all the images, fonts and sound tracks you use to make your game better. And if you are using pygame in general, you can place the assets wherever you feel like, but with pygbag, you would need to place all your assets inside your game folder, without it your program won't run. Thought if your game doesn't need any assets then you are good to go ahead not using the assets folder.

### Importing other libraries
Libraries ae basically packets of code, they are used by people to avoid the complexity of doing certain things, for eg. pygame is a graphics rendering library, and people use it so that they don't need to code all those functionalities by themselves. You wouldn't need to change anything to use libraries, you can import them how you usually do!

>NOTE: There's an issue related to the numpy module, and using it would break your game, so I suggest not to use it.

### Code
You won't need to change much of your code to enable it to run with pygbag.
The necessary changes you need to make are: 
1. Add an `import asyncio
2. encapsulate your variable declarations(other than the window as other functions might use it too) and mainloop inside the main() function. don't forget to make it an async function (just put async before def)
3. write this line right after `pygame.display.update()`, `await asyncio.sleep(0)`
4. In the last line of the program, out side th main function write this line `asyncio.run( main() )`
> NOTE: Don't write anything after this line as this line is kind of like running the code and anything after this line would be ignored by the program.

## Uploading your game on itch.io (Optional)
So, for others to be able to play your game you online, you would need to publish your game in some platform like itch.io

### Zipping the files
So to upload you website to itch.io you would need to zip its source code and upload it to itch.io
for that for
1. go inside your game folder
2. go inside the build folder
3. go inside the web folder
4. then select the contents inside the folder
5. zip those contents

### Uploading to itch.io
So to upload the file
1. Create a new project
2. Select the Kind of project as HTML
3. Upload the .zip file on the website
4. Select `This file will be played in the browser`
5. Then save your project

After following these step, if you view your game page, then you would be able to see you game.
Thought, if your are unable to do so, you can ask for help in the [pygame discord server](https://discord.gg/s6Hhrh77aq)

## Conclusion
Congratulations! You were able to finish this tutorial on pygbag, now you can go ahead and try to make all your games available in the web too!!<br>
Thank you for following along!

[Spotted a mistake? Contribute to this page.](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygbag/README.md)
