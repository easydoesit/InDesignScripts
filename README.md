# Adobe Indesign Storyboard Layout Script

This simple script allows you to add storyboards (images from a source directory) into multiple layouts.
The script relies on the existing layout, so you must download the file Storyboards.indd and the script.

##To Use
1. Add the script to the ~/Library/Preferences/Adobe InDesign/Version ##.#/en_US/Scripts/Scripts Panel/ folder. (sometimes, its easier to find this by opening Indesign and right-clicking on another script from the scripts panel)
2. Then, double-click the script and fill in the info.

### ALERT only have Images in your source directory

## What it does
1. It sorts all the images, so it's best to label them with numbers. Start with 01 if you have multiples of 10, and 001 if you have multiples of 100.
2. On Mac, it removes the .DS_Store file from the sort
3. It then lays out all the text boxes and image boxes and fills them with the images.
4. You can then fill in the information you need for each box.

## Known Issues
1. It doesn't sort images based on file types. Only name.
2. Any other files in the directory will be considered images, but InDesign can't interpret them, so remove them; otherwise, they will mess up your layout. For example, any .doc file would cause a problem, and you would get an extra blank spot in your layout.
3. Hidden files are also found so don't have any in the source directory
4. Not tested on PC.

## Future plans
1. Check for known image files in the source directory
