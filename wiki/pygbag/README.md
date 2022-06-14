# *Home*
Hey there, Welcome to the Pygbag Wiki!
> In this wiki, you will learn how to use pygbag, and how to convert your game, made with pygame, to web.

#### Chapters in this wiki
* Installation
* Web Testing
* Templates
* Project Setup
* Bonus: Uploading your game on itch.io
* The End
***

# *Installation*
## In this chapter you will install pygbag
So, to use any library, including pygbag, you would need to install that library, using a tool called pip

pip is a tool used to install libraries, it can be installed while installing python.

### Check if your device has pip
1. Open your command prompt
2. type `pip` in it and if it shows a ton of text, then you are good to go. But if shows something like <br>
`'pip' is not recognized as an internal or external command, operable program or batch file.`<br>
Then you can watch [this](https://www.youtube.com/watch?v=AdUZArA-kZw) tutorial to fix that.

### Install pygbag
1. Like the previous step, open your command prompt
2. Type the following command in it:<br>
`pip install git+https://github.com/pmp-p/pygbag --user --upgrade`<br>
This would install and upgrade pygbag onto your device
> The following command would install the pygbag repository in your device, though if you want you can also run this command<br>`pip install pygbag --upgrade`<br>This would install as well as update it so as to get the most recent version of the library. But this command is less preferred as just in case
the author forgets to publish the latest version of the library to PyPI.
***

# *Web Testing*
## In this chapter, you will test out pygbag
So, now we will check out how to run our games on web using pygbag.

### Creating a project
Firstly, make a folder. This folder would include all your game files.

Now, add a main.py inside that folder and put this code inside it<br>
```
import asyncio
import pygame

pygame.init()
pygame.display.set_mode((320, 240))
pygame.display.set_caption("TEST")


async def main():
    count = 3

    while True:
        print(f"""

        Hello[{count}] from Pygame

""")
        pygame.display.update()
        await asyncio.sleep(0)  # very important, and keep it 0

        if not count:
            pygame.quit()
            return
        count = count - 1

asyncio.run( main() )
```
You don't need to understand what this code does, for now, as this is just some test code to check if you have the right setup.

### Running your code with pygbag
Now open your command line and and get into the parent directory of the folder you had created.
> Parent directory as in the directory which holds the folder.
Now type this command into it and press enter<br>
`pygbag folder_name`<br>
replace folder_name with the name that you gave to your game folder.

After running this command go to your preferred web browser, and go to https://localhost:8000 and it should show something like
![image](https://user-images.githubusercontent.com/78538391/169882643-a93622e2-99fe-4f71-90ed-017ab2da51c6.png)
> Don't worry if you didn't get the same result, just try redoing the previous steps, and if even that doesn't work, you can feel free to join the [pygame discord server](https://discord.gg/653AkjMd) and ask your queries there!

If you were able to complete this step, congratulations you were successfully able to setup pygbag and also able to test it out.
***

# *Templates*
## In this chapter you will learn about templates in pygbag
So, you might be wondering that how will the players play your game if your window looks so small and the console takes up so much of place. To fix this, you can change the layout of the webpage using templates.

### Using other templates
So currently, pygbag uses the default template which you might wanna change, for that there are 2 ways you can try
#### 1. Using the in-built templates
For that you can use the following command<br>
`pygbag --template window-template.tmpl folder_name`<br>
this would now use the window-template which is prebuilt in pygbag and this template would clear everything except the window, from the webpage and align your game window to the top right corner.

#### 2. Installing a template and customizing it
For this you can go to the static folder in the [pygbag repo](https://github.com/pmp-p/pygbag/tree/main/static) and from there install one of the templates and then you can use the following command:<br>
`pygbag --template template-name.tmpl test`<br>
replace template-name with the name you gave to the .tmpl file and running tht would port your game to web with your desired template
<br><br>
Using the second approach would be better and also recommended, as in this approach, you can customize the template as per your choice and test out how would they look.(ps. the files are basically html files with internal styling and  internal javascript scripting)
>NOTE: Almost all line are important, so please think a lot before deleting a line which might seem important, cause even one important line could break the whole thing
***

# *Project Setup*
## In this chapter you will learn how to setup your project

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

# *Uploading your game on itch.io (Bonus)*
## In this chapter you will learn how to upload your game on itch.io
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
Thought, if your are unable to do so, you can ask for help in the [pygame discord server](https://discord.gg/653AkjMd)

# *The End*
Congratulations! You were able to finish this tutorial on pygbag, now you can go ahead and try to make all your games available in the web too!!<br>
Thank you for following along!
