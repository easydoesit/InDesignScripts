var myDoc = app.activeDocument;
var DSBS = ".DS_Store"
//Open a dialogue to choose a folder.
var myFolder = Folder.selectDialog("Choose a Folder");
if (myFolder != null) {
  var allImages = myFolder.getFiles();
  allImages.sort();
  var imageAmount = allImages.length;

  //count through all images
  for (var i = 0; i < imageAmount; i++) {
    //Check to see if the .DS_Store file exists on Mac.
    if (allImages[0] == myFolder + "/" + DSBS) {
      allImages.shift();
      imageAmount = imageAmount - 1;
    };
  };
  var oddNumber = imageAmount % 2;
  if (oddNumber == 1) {
    for (var i = 2; i <= imageAmount; i = i + 2) {
      np = myDoc.pages.add();
    };
  };
  if (oddNumber != 1) {
    for (var i = 3; i <= imageAmount; i = i + 2) {
      np = myDoc.pages.add();
    };
  };
  var myPages = myDoc.pages;
  //place all required Image and Text boxes with proper formatting.
  for (var i = 0; i < myPages.length; i++) {
    //put image inside the top storyboard
    var storyboard1 = myPages[i].rectangles.add({ geometricBounds: [0.81360101140728, 1.47011340614745, 3.97753056853144, 7.09558015871421], fillColor: myDoc.swatches.item("None"), strokeColor: myDoc.swatches.item("Black"), name: "storyboard" })
    storyboard1.place(allImages[i * 2], false);
    storyboard1.fit(FitOptions.FILL_PROPORTIONALLY);
    storyboard1.fit(FitOptions.FRAME_TO_CONTENT);
    //put image inside bottom storyboard if there are any images left.
    var storyboard2 = myPages[i].rectangles.add({ geometricBounds: [5.6945304165179, 1.47116765403961, 8.85727409299847, 7.09452591082206], fillColor: myDoc.swatches.item("None"), strokeColor: myDoc.swatches.item("Black"), name: "storyboard" })
    if (i * 2 < imageAmount - 1) {
      storyboard2.place(allImages[i * 2 + 1], false);
      storyboard2.fit(FitOptions.FILL_PROPORTIONALLY);
      storyboard2.fit(FitOptions.FRAME_TO_CONTENT);
    };
    var textFrame1 = myPages[i].textFrames.add({ geometricBounds: [4.60182880458925, 0.67956135390093, 5.40503620060885, 4.11654497041073], name: "textArea" });
    textFrame1.contents = "-";
    var textObject1 = textFrame1.parentStory.paragraphs.item(0);
    textObject1.appliedFont = app.fonts.item("Minion Pro");
    textObject1.pointSize = 10;

    var textFrame2 = myPages[i].textFrames.add({ geometricBounds: [4.60182880458925, 4.27840614207137, 5.40503620060885, 7.71538975858117], name: "textArea" });
    textFrame2.contents = "-";
    var textObject2 = textFrame2.parentStory.paragraphs.item(0);
    textObject2.appliedFont = app.fonts.item("Minion Pro");
    textObject2.pointSize = 10;

    var textFrame3 = myPages[i].textFrames.add({ geometricBounds: [9.43944205740092, 0.67956135390093, 10.2426494534205, 4.11654497041073], name: "textArea" });
    textFrame3.contents = "-";
    var textObject3 = textFrame3.parentStory.paragraphs.item(0);
    textObject3.appliedFont = app.fonts.item("Minion Pro");
    textObject3.pointSize = 10;

    var textFrame4 = myPages[i].textFrames.add({ geometricBounds: [9.43944205740092, 4.27840614207137, 10.2426494534205, 7.71538975858117], name: "textArea" });
    textFrame4.contents = "-";
    var textObject4 = textFrame4.parentStory.paragraphs.item(0);
    textObject4.appliedFont = app.fonts.item("Minion Pro");
    textObject4.pointSize = 10;

    var textFrame5 = myPages[i].textFrames.add({ geometricBounds: [0.75, 0.125, 1.04966353521118, 0.55333333333333], name: "shotNumber" });
    var shotCount = (i * 2) + 1;
    textFrame5.contents = shotCount.toString();
    var textObject5 = textFrame5.parentStory.paragraphs.item(0);
    textObject5.appliedFont = app.fonts.item("Helvetica");
    textObject5.fontStyle = "Bold";
    textObject5.pointSize = 7;
    textObject5.justification = Justification.rightAlign;

    var shotCount = (i * 2) + 2;

    var textFrame6 = myPages[i].textFrames.add({ geometricBounds: [5.63033646478882, 0.125, 5.93, 0.55333333333333], name: "shotNumber" });
    textFrame6.contents = shotCount.toString();
    var textObject6 = textFrame6.parentStory.paragraphs.item(0);
    textObject6.appliedFont = app.fonts.item("Helvetica");
    textObject6.fontStyle = "Bold";
    textObject6.pointSize = 7;
    textObject6.justification = Justification.rightAlign;
  };
};
