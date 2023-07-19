#target "Indesign";

const doc = app.activeDocument;
const DSBS = ".DS_Store"
var sbStyle = null;
var imageAmount = 0;
var sortedImages = null;
var pages = null;
var textAreaContent = "-"

///functions///

//makeBoard lays out all the boards with the images in them
//takes the layoutNum 0 = top, 1 = bottom
//bounds is array to define the shape
//page is the current page number
//images is the folder of images
const makeBoard = function (layoutNum, bounds, page, images, imagesPerPage) {

  const board = pages[page].rectangles.add(
    {
      geometricBounds: bounds,
      fillColor: doc.swatches.item("None"),
      strokeColor: doc.swatches.item("Black"),
      name: "storyboard"
    }
  );

  board.place(images[page * imagesPerPage + layoutNum], false);
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
    textFrame = doc.masterSpreads[page].textFrames.add({
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
  }

  if (type === "title") {
    textObject.appliedFont = app.fonts.item("Helvetica");
    textObject.fontStyle = "Bold";
    textObject.pointSize = 10;
    textObject.justification = Justification.leftAlign;
  }

};

//layout takes in boardsperpage 2 or 8
//spread 0 or 1 where 0 is master page with 2 boards and 1 is with 8
//sbBounds arr of all the storyboard bounds
//actionTextbounds arr of all the action boxes bounds
//dialogueTextBounds arr of all the dialogue boxes bounds
//shotCountBounds arr of all the shot count boxes bounds
//the function will layout all the boxes based on prescribed variables
const layout = function (boardsPerPage, spread, sbBounds, actionTextBounds, dialogueTextBounds, shotCountBounds) {
  //get the number of pages divided by storyboard per page.
  const numberOfPages = Math.ceil(imageAmount / boardsPerPage);
  var actionCount = imageAmount;
  alert("boardsPerPage" + boardsPerPage)
  alert("imageamoint " + imageAmount);
  alert("numberOfPage s" + numberOfPages);
  //check to see if the number of pages is more than 1. ie 8 storyboards would go on 1 page.
  if (numberOfPages === 1) {
    for (var i = boardsPerPage; i <= imageAmount; i = i + boardsPerPage) {
      np = doc.pages.add();
    };
  };
  //if the number of pages is larger than 1
  if (numberOfPages > 1) {
    for (var i = boardsPerPage + 1; i <= imageAmount; i = i + boardsPerPage) {
      np = doc.pages.add();
    };
  };
  //get all the pages.
  pages = doc.pages;

  // change the master page to match the layout
  const masterSpread = doc.masterSpreads[spread];

  for (var i = 0; i < pages.length; i++) {
    var page = pages.item(i);
    page.appliedMaster = masterSpread;
  };

  //place all required Image and Text boxes with proper formatting.
  for (var pageNum = 0; pageNum < pages.length; pageNum++) {

    //draw the graphics
    for (var shotCount = 0; shotCount <= boardsPerPage - 1; shotCount++) {
      if (pageNum * boardsPerPage < imageAmount - 1 && actionCount > 0) {

        //shotcount boxes
        var shotCountNum = (pageNum * boardsPerPage) + shotCount + 1;
        makeTextBox(shotCountBounds[shotCount], pageNum, "shotNumber", shotCountNum.toString(), null);

        //storyboard boxes
        makeBoard(shotCount, sbBounds[shotCount], pageNum, sortedImages, boardsPerPage);

        //top action box
        makeTextBox(actionTextBounds[shotCount], pageNum, "textArea", textAreaContent, null);

        //dialogue box
        makeTextBox(dialogueTextBounds[shotCount], pageNum, "textArea", textAreaContent, null);

        actionCount = actionCount - 1;
      }
    };
  };
};


// alert functions
const showAlert = function () {
  alert("You must fill in all the fields");
}

// the main function

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
      imageAmount = sortedImages.length;


      //count through all images
      for (var i = 0; i < imageAmount; i++) {
        //Check to see if the .DS_Store file exists on Mac.
        if (sortedImages[0] === folder + "/" + DSBS) {
          sortedImages.shift();
          imageAmount = imageAmount - 1;
        };
      };
      alert("imageAmount: " + imageAmount);
    };
  };

  //Open a dialogue to choose where to save the file
  saveFolderButton.onClick = function () {
    saveFolder.text = Folder.selectDialog("Select Folder to Save this File.");
  };

  //button2 pressed
  button2.onClick = function () {
    if (docTitle.text && saveFolder.text && sbFolderText.text) {
      dlg.close();
      sbStyle = 2;
    } else {
      showAlert();
    }
  };

  //button8 pressed
  button8.onClick = function () {
    if (docTitle.text && saveFolder.text && sbFolderText.text) {
      dlg.close();
      sbStyle = 8;
    }
    else {
      showAlert();
    }
  };

  dlg.show();

  if (sbStyle === 2) {
    const titleBounds2 = [0.2608, 0.685, 0.4212, 3.895];

    //storyboard geometry bounds inches
    const boardBounds2 = [
      [0.8136, 1.4701, 3.9775, 7.0956],
      [5.6945, 1.4712, 8.8572, 7.0945]
    ];

    const actionBounds2 = [
      [4.6018, 0.6796, 5.405, 4.1165],
      [9.4394, 0.6796, 10.2426, 4.1165]
    ];

    const dialogBounds2 = [
      [4.6018, 4.2784, 5.4050, 7.7154],
      [9.4394, 4.2784, 10.2426, 7.7153]
    ]

    const shotCountBounds2 = [
      [0.75, 0.125, 1.0497, 0.5533],
      [5.6303, 0.125, 5.93, 0.5533]
    ]


    //create the title frame on the master page
    makeTextBox(titleBounds2, 0, "title", docTitle.text, true);
    //run the 2 layout per page function
    layout(2, 0, boardBounds2, actionBounds2, dialogBounds2, shotCountBounds2);
  };

  if (sbStyle === 8) {
    const titleBounds8 = [0.2608, 0.6331, 0.3946, 3.895];

    //storyboard geometry bounds in inches
    const boardBounds8 = [
      [0.9139, 0.25, 2.3231, 2.75],
      [0.9139, 2.9167, 2.3231, 5.4167],
      [0.9139, 5.5972, 2.3231, 8.0833],
      [0.9139, 8.25, 2.3231, 10.75],
      [4.656, 0.25, 6.0652, 2.75],
      [4.656, 2.9167, 6.0652, 5.4167],
      [4.656, 5.5972, 6.0652, 8.0833],
      [4.656, 8.25, 6.0652, 10.75]
    ];

    const actionBounds8 = [
      [2.6351, 0.2985, 3.2747, 2.6969],
      [2.6351, 2.9652, 3.2747, 5.3706],
      [2.6351, 5.6318, 3.2747, 8.0372],
      [2.6351, 8.2985, 3.2747, 10.7027],
      [6.3668, 0.2985, 7.0064, 2.6969],
      [6.3668, 2.9652, 7.0064, 5.3706],
      [6.3668, 5.6318, 7.0064, 8.0372],
      [6.3668, 8.2985, 7.0064, 10.7027]
    ];

    const dialogBounds8 = [
      [3.5004, 0.2985, 4.14, 2.6969],
      [3.5004, 2.9652, 4.14, 5.3706],
      [3.5004, 5.6318, 4.14, 8.0372],
      [3.5004, 8.2985, 4.14, 10.7027],
      [7.2321, 0.2985, 7.8717, 2.6969],
      [7.2321, 2.9652, 7.8717, 5.3706],
      [7.2321, 5.6318, 7.8717, 8.0372],
      [7.2321, 8.2985, 7.8717, 10.7027]
    ];

    const shotCountBounds8 = [
      [0.6179, 0.5445, 0.6992, 0.9784],
      [0.6179, 3.2181, 0.6992, 3.6382],
      [0.6179, 5.8847, 0.6992, 6.3048],
      [0.6179, 8.5514, 0.6992, 8.9715],
      [4.36, 0.5445, 4.4691, 0.9784],
      [4.36, 3.2181, 4.4691, 3.6382],
      [4.36, 5.8847, 4.4691, 6.3048],
      [4.36, 8.5514, 4.4691, 8.9715],
    ];

    //create the title frame on the master page
    makeTextBox(titleBounds8, 1, "title", docTitle.text, true);
    //run the layout per page function
    layout(8, 1, boardBounds8, actionBounds8, dialogBounds8, shotCountBounds8);
  };

  if (dlg.show !== 1) {
    exit();
    return;
  }
};

main();