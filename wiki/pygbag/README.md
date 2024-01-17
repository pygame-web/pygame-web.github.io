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
When packaging, Pygbag sets up a local server which runs your game and provides debug information. This is only accessible from your own computer. If this is unwanted, add `--build` to the command line options.

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

After running this command, navigate to [localhost:8000#debug](https://localhost:8000#debug) and it should show a page like this: 
![image](https://user-images.githubusercontent.com/78538391/169882643-a93622e2-99fe-4f71-90ed-017ab2da51c6.png)
> If the page doesn't load, try the previous steps again. If it still does not package your game correctly, you can join the [Pygame's discord server](https://discord.gg/653AkjMd) to ask for help.

If you were able to complete this step, congratulations! You have successfully set up Pygbag and tested that your game runs in the browser!

## Templates
So, you might be wondering that how will the players play your game if your window looks so small and the console takes up so much of place. To fix this, you can change the layout of the webpage using templates or remove the #debug from url.

### Using other templates
Currently, pygbag uses the default template which you might wanna change, for that there are 2 ways you can try

#### 1. Using the in-built templates
For that you can use the following command<br>
`pygbag --template default.tmpl folder_name`<br>
this would now use the default template which is prebuilt in pygbag and this template would clear everything except the window on normal mode , or in #debug mode align your game window to the top right corner in debug mode to half the page and display the terminal, file upload widget and iframe + some controls.

#### 2. Installing a template and customizing it
For this you can go to the static folder in the [pygbag repo](https://github.com/pygame-web/pygbag/tree/main/static) and look for the various templates available online.
<br>
To use one of them go with the following command:<br>
`pygbag --template template-name.tmpl test`<br>
replace template-name with the name given to the .tmpl file.
Run again will port your game to web with your desired template without need to erase the cache.
<br>
If you want to use a template of your own just give the full path of your template file instead. The simplest way is to copy the above online templates to your drive and edit them.
<br><br>
Using the second approach would be better and also recommended, as in this approach, you can customize the template as per your choice and test out how would they look.(ps. the files are basically html files with internal styling and  internal javascript scripting)
>NOTE: Almost all line are important, so please think a lot before deleting a line, because only one missing line  could break the whole thing.
***

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
