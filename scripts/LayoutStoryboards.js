#target "Indesign";

const doc = app.activeDocument;
const DSBS = ".DS_Store"

//Open a dialogue to choose a folder.
const folder = Folder.selectDialog("Choose a Folder");

if (folder != null) {
  const allImages = folder.getFiles();
  const sortedImages = allImages.sort();
  var imageAmount = allImages.length;

  //count through all images
  for (var i = 0; i < imageAmount; i++) {
    //Check to see if the .DS_Store file exists on Mac.
    if (sortedImages[0] === folder + "/" + DSBS) {
      sortedImages.shift();
      imageAmount = imageAmount - 1;
    };
  };

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

  const makeTextBox = function (bounds, page, type,) {
    if (type === "textArea") {
      var textFrame = pages[page].textFrames.add({
        geometricBounds: bounds,
        name: type
      });
      textFrame.contents = "-"
      var textObject = textFrame.parentStory.paragraphs.item(0);
      textObject.appliedFont = app.fonts.item("Minion Pro");
      textObject.pointSize = 12;
    }
  };

  //2 per page on portrait Layout.//
  //get the number of pages divided by 2.
  const oddNumber = imageAmount % 2;

  //check to see if the number of pages is more than 1. ie 2 storyboards would go on 1 page.
  if (oddNumber === 1) {
    for (var i = 2; i <= imageAmount; i = i + 2) {
      np = doc.pages.add();
    };
  };
  //if the number of pages is larger than 1
  if (oddNumber !== 1) {
    for (var i = 3; i <= imageAmount; i = i + 2) {
      np = doc.pages.add();
    };
  };
  //get all the pages.
  const pages = doc.pages;

  //place all required Image and Text boxes with proper formatting.
  for (var pageNum = 0; pageNum < pages.length; pageNum++) {
    //storyboard geometry bounds
    var topBounds = [0.81360101140728, 1.47011340614745, 3.97753056853144, 7.09558015871421];
    var botBounds = [5.6945304165179, 1.47116765403961, 8.85727409299847, 7.09452591082206];
    //textFrame geometry bounds
    var text1Bounds = [4.60182880458925, 0.67956135390093, 5.40503620060885, 4.11654497041073];
    var text2Bounds = [4.60182880458925, 4.27840614207137, 5.40503620060885, 7.71538975858117];
    var text3Bounds = [9.43944205740092, 0.67956135390093, 10.2426494534205, 4.11654497041073];
    var text4Bounds = [9.43944205740092, 4.27840614207137, 10.2426494534205, 7.71538975858117];

    //draw the storyboards and add the images
    makeBoard(0, topBounds, pageNum, sortedImages);

    if (pageNum * 2 < imageAmount - 1) {
      makeBoard(1, botBounds, pageNum, sortedImages);
    }

    // create the text frames for each storyboard

    makeTextBox(text1Bounds, pageNum, "textArea");
    makeTextBox(text2Bounds, pageNum, "textArea");
    makeTextBox(text3Bounds, pageNum, "textArea");
    makeTextBox(text4Bounds, pageNum, "textArea");

    //create the text frame for the top shot count.
    var textFrame5 = pages[pageNum].textFrames.add({ geometricBounds: [0.75, 0.125, 1.04966353521118, 0.55333333333333], name: "shotNumber" });
    var shotCount = (i * 2) + 1;
    textFrame5.contents = shotCount.toString();
    var textObject5 = textFrame5.parentStory.paragraphs.item(0);
    textObject5.appliedFont = app.fonts.item("Helvetica");
    textObject5.fontStyle = "Bold";
    textObject5.pointSize = 7;
    textObject5.justification = Justification.rightAlign;
    //create the text frame for the bottom shot
    var shotCount = (i * 2) + 2;

    var textFrame6 = pages[pageNum].textFrames.add({ geometricBounds: [5.63033646478882, 0.125, 5.93, 0.55333333333333], name: "shotNumber" });
    textFrame6.contents = shotCount.toString();
    var textObject6 = textFrame6.parentStory.paragraphs.item(0);
    textObject6.appliedFont = app.fonts.item("Helvetica");
    textObject6.fontStyle = "Bold";
    textObject6.pointSize = 7;
    textObject6.justification = Justification.rightAlign;
  };
};
