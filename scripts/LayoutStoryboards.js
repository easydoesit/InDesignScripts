#target "Indesign";

const doc = app.activeDocument;
const DSBS = ".DS_Store"
var sbStyle = null;
var imageAmount = 0;
var sortedImages = null;
var pages = null;

///functions///
//makeBoard lays out all the boards with the images in them
//takes the layoutNum 0 = top, 1 = bottom
//bounds is array to define the shape
//page is the current page number
//images is the folder of images
const makeBoard = function (layoutNum, bounds, page, images) {

  const board = pages[page].rectangles.add(
    {
      geometricBounds: bounds,
      fillColor: doc.swatches.item("None"),
      strokeColor: doc.swatches.item("Black"),
      name: "storyboard"
    }
  );

  board.place(images[page * 2 + layoutNum], false);
  board.fit(FitOptions.FILL_PROPORTIONALLY);
  board.fit(FitOptions.FRAME_TO_CONTENT);
};

//makeTextBox lays out all the textBoxes with the starter Content in them
//bounds is array to define the shape
//page is the current page number or page name
//type is the kind of textbox for different values
//content is whats in the first paragraph
//master is null or true for picking master spreads.
const makeTextBox = function (bounds, page, type, contents, master) {
  var textFrame = null;
  if (!master) {
    textFrame = pages[page].textFrames.add({
      geometricBounds: bounds,
      name: type,
      contents: contents
    });
  } else {
    textFrame = doc.masterSpreads[0].textFrames.add({
      geometricBounds: bounds,
      name: type,
      contents: contents
    });
  }

  var textObject = textFrame.parentStory.paragraphs.item(0);

  if (type === "textArea") {
    textObject.appliedFont = app.fonts.item("Minion Pro");
    textObject.pointSize = 12;
  };

  if (type === "shotNumber") {
    textObject.appliedFont = app.fonts.item("Helvetica");
    textObject.fontStyle = "Bold";
    textObject.pointSize = 7;
    textObject.justification = Justification.rightAlign;
  }

  if (type === "title") {
    textObject.appliedFont = app.fonts.item("Helvetica");
    textObject.fontStyle = "Bold";
    textObject.pointSize = 10;
    textObject.justification = Justification.leftAlign;
  }

};

//layout2 per page on portrait Layout.//
const layout2 = function () {
  //get the number of pages divided by storyboard per page.
  const numberOfPages = imageAmount % 2;

  //check to see if the number of pages is more than 1. ie 2 storyboards would go on 1 page.
  if (numberOfPages === 1) {
    for (var i = 2; i <= imageAmount; i = i + 2) {
      np = doc.pages.add();
    };
  };
  //if the number of pages is larger than 1
  if (numberOfPages !== 1) {
    for (var i = 3; i <= imageAmount; i = i + 2) {
      np = doc.pages.add();
    };
  };
  //get all the pages.
  pages = doc.pages;

  //place all required Image and Text boxes with proper formatting.
  for (var pageNum = 0; pageNum < pages.length; pageNum++) {
    //storyboard geometry bounds inches
    var topBounds = [0.8136, 1.4701, 3.9775, 7.0956];
    var botBounds = [5.6945, 1.4712, 8.8572, 7.0945];

    //textFrame geometry bounds inches
    var text1Bounds = [4.6018, 0.6796, 5.405, 4.1165];
    var text2Bounds = [4.6018, 4.2784, 5.4050, 7.7154];
    var text3Bounds = [9.4394, 0.6796, 10.2426, 4.1165];
    var text4Bounds = [9.4394, 4.2784, 10.2426, 7.7153];
    var shotCountTopBounds = [0.75, 0.125, 1.0497, 0.5533];
    var shotCountBottomBounds = [5.6303, 0.125, 5.93, 0.5533];

    //textarea Contents
    var textAreaContent = "-"
    var shotCounttop = (pageNum * 2) + 1;
    var shotCountBottom = (pageNum * 2) + 2;
    shotCounttop = shotCounttop.toString();
    shotCountBottom = shotCountBottom.toString();

    //draw the storyboards and add the images
    makeBoard(0, topBounds, pageNum, sortedImages);

    if (pageNum * 2 < imageAmount - 1) {
      makeBoard(1, botBounds, pageNum, sortedImages);
    }

    // create the text frames for each storyboard
    makeTextBox(text1Bounds, pageNum, "textArea", textAreaContent, null);
    makeTextBox(text2Bounds, pageNum, "textArea", textAreaContent, null);
    makeTextBox(text3Bounds, pageNum, "textArea", textAreaContent, null);
    makeTextBox(text4Bounds, pageNum, "textArea", textAreaContent, null);

    //create the text frames for the shot count.
    makeTextBox(shotCountTopBounds, pageNum, "shotNumber", shotCounttop, null);
    makeTextBox(shotCountBottomBounds, pageNum, "shotNumber", shotCountBottom, null);
  };
};

const main = function () {
  saveLocation = "";
  sbLocation = "";

  const dlg = new Window("dialog", "Options");

  const titleGroup = dlg.add("group");
  titleGroup.add("statictext", undefined, "Title of Document:");
  titleGroup.orientation = "row";
  titleGroup.alignment = "left";
  var docTitle = titleGroup.add("edittext");
  docTitle.characters = 50;
  docTitle.active = true

  const folderGroup = dlg.add("group");
  folderGroup.orientation = "row";
  folderGroup.alignment = "left";
  folderGroup.add("statictext", undefined, "Storyboards Location:");
  var sbFolderText = folderGroup.add("edittext");
  sbFolderText.characters = 50;
  const sbFolderButton = folderGroup.add("button", undefined, "Choose Folder");

  const saveLocationGroup = dlg.add("group");
  saveLocationGroup.orientation = "row";
  saveLocationGroup.alignment = "left";
  saveLocationGroup.add("statictext", undefined, "Save Folder:");
  var saveFolder = saveLocationGroup.add("edittext");
  saveFolder.characters = 50;
  const saveFolderButton = saveLocationGroup.add("button", undefined, "Choose Save Location");

  const styleGroup = dlg.add("group");
  styleGroup.orientation = "row";
  styleGroup.alignment = "left";
  styleGroup.add("statictext", undefined, "Boards per page:");
  const button2 = styleGroup.add("button", undefined, "2");
  const button8 = styleGroup.add("button", undefined, "8");

  dlg.add("button", undefined, "Cancel");

  //Open a dialogue to choose the folder where the boards are.
  sbFolderButton.onClick = function () {
    var query = Folder.selectDialog("Select Folder Where Storyboards are Saved.");
    sbFolder = query;
    sbFolderText.text = query;

    if (sbFolder !== null) {
      const allImages = sbFolder.getFiles();
      sortedImages = allImages.sort();
      imageAmount = allImages.length;

      //count through all images
      for (var i = 0; i < imageAmount; i++) {
        //Check to see if the .DS_Store file exists on Mac.
        if (sortedImages[0] === folder + "/" + DSBS) {
          sortedImages.shift();
          imageAmount = imageAmount - 1;
        };
      };
    };
  };

  //Open a dialogue to choose where to save the file
  saveFolderButton.onClick = function () {
    saveFolder.text = Folder.selectDialog("Select Folder to Save this File.");
  };

  button2.onClick = function () {
    if (docTitle.text && saveFolder.text && sbFolderText.text) {
      dlg.close();
      sbStyle = 2;
    } else {
      alert("You must fill in all the fields");
    }
  }

  dlg.show();

  if (sbStyle === 2) {
    const titleBounds = [0.2608, 0.685, 0.4212, 3.895];
    //create the title frame on the master page
    makeTextBox(titleBounds, 0, "title", docTitle.text, true);
    //run the 2 layout per page function
    layout2();
  };

  if (dlg.show !== 1) {
    exit();
    return;
  }
};

main();

