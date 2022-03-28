// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
//////// Settings /////////
const thresholds = {
  amber: 60,
  green: 100
}

const debugging = 1

let darkmode = null
let balance = null
let loginCredentials = []
try {
  loginCredentials = args.widgetParameter.split(';')
} catch { }



let widget = await createWidget();

// Check where the script is running
if (config.runsInWidget) {
  // Runs inside a widget so add it to the homescreen widget
  Script.setWidget(widget);
} else {
  // Show the small widget inside the app
  widget.presentSmall();
}


Script.complete();



async function createWidget() {
  // Create new empty ListWidget instance
  let listwidget = new ListWidget();
  listwidget.setPadding(14, 14, 4, 14)
  //   listwidget.useDefaultPadding()
  // Set new background color
  //   listwidget.backgroundColor = new Color("#ffffff");

  // Add widget heading
  /*let heading = listwidget.addText("🚀Next🚀");
  heading.centerAlignText();
  heading.font = Font.lightSystemFont(25);
  heading.textColor = new Color("#ffffff");

  // Spacer between heading and launch date
  listwidget.addSpacer(15);
  */

  let heading = listwidget.addText("Laundry Status")
  heading.centerAlignText()
  heading.font = Font.boldSystemFont(14);

  listwidget.addSpacer(5)

  let laundryStatus = await getLaundryStatus()

  addWashStack(listwidget, laundryStatus.wash)


  let dryerStack = listwidget.addStack();
  dryerStackFiller(dryerStack, laundryStatus.dryer);

  listwidget.addSpacer(9);


  let updatedStack = listwidget.addStack()
  updatedStack.setPadding(0, 6, 0, 6)
  updatedStack.addSpacer(0.1)
  let createdByStack = updatedStack.addStack()
  createdByStack.layoutVertically()
  createdByStack.topAlignContent()
  createdByStack.addSpacer(2) // 1.9
  createdByStack.spacing = -0.3 //-0.5
  let createdByText = createdByStack.addText("created by")
  createdByText.font = Font.lightSystemFont(3.62) //3
  let createdByNL = createdByStack.addText("NICLAS LACH")
  createdByNL.font = Font.regularSystemFont(3.2) //5



  updatedStack.addSpacer()

  if (loginCredentials.length == 2) {
    let balanceText = updatedStack.addText(balance)
    balanceText.font = Font.lightSystemFont(9)
  }


  updatedStack.addSpacer() // 60

  const updatedAt = new Date()
  const updatedText = updatedStack.addText(`${updatedAt.getHours()}:${("00" + updatedAt.getMinutes()).slice(-2)}`);
  updatedText.font = Font.lightSystemFont(9)
  updatedText.rightAlignText()

  updatedStack.addSpacer(0.1)
  //   let icon = await getImage('laundry.png');
  //   listwidget.addImage(getDiagram(80, "1", icon));
  //listwidget.addImage(getDiagram(80));
  //listwidget.addSpacer(50);
  // Return the created widget
  return listwidget;
}




function addWashStack(listwidget, machines) {

  let washStacks = [listwidget.addStack()];

  machines.forEach((machine, index) => {
//     if (index % 4 == 0 && index > 0) {
//       washStacks.push(listwidget.addStack())
//     }
//     washStacks[Math.floor(index/4)].addImage(getDiagram(machine, String(index + 1), "laundry"));  
      washStacks[0].addImage(getDiagram(machine,String(index + 1), "laundry"))
  })
}

function dryerStackFiller(stack, machines) {
  machines.forEach((machine, index) => {
    stack.addImage(getDiagram(machine, String(index + 1), "dryer"));
  })
}

function getDiagram(percentage, text, machine) {
  function drawArc(ctr, rad, w, deg) {
    bgx = ctr.x - rad
    bgy = ctr.y - rad
    bgd = 2 * rad
    bgr = new Rect(bgx, bgy, bgd, bgd)



    let color
    if (percentage > thresholds.green) {
      color = Color.green()
    } else if (percentage > thresholds.amber) {
      color = Color.orange()
    } else {
      color = Color.red()
    }
    canvas.setFillColor(Color.white())
    canvas.setStrokeColor(Color.lightGray())
    canvas.setLineWidth(w)
    canvas.fillEllipse(bgr)
    canvas.strokeEllipse(bgr)


    canvas.setFillColor(color)

    for (t = 0; t < deg; t++) {
      rect_x = ctr.x + rad * sinDeg(t) - w / 2
      rect_y = ctr.y - rad * cosDeg(t) - w / 2
      rect_r = new Rect(rect_x, rect_y, w, w)
      canvas.fillEllipse(rect_r)
    }
  }
  function sinDeg(deg) {
    return Math.sin((deg * Math.PI) / 180)
  }

  function cosDeg(deg) {
    return Math.cos((deg * Math.PI) / 180)
  }
  const canvas = new DrawContext()
  const canvSize = 200
  const canvTextSize = 45

  const canvWidth = 12
  const canvRadius = 80

  const margin = 25
  let textOffset = new Number()

  canvas.opaque = false
  canvas.size = new Size(canvSize, canvSize)
  canvas.respectScreenScale = false

  drawArc(
    new Point(canvSize / 2, canvSize / 2),
    canvRadius,
    canvWidth,
    Math.floor(percentage * 3.6)
  )


/*
  console.log(darkmode)
  switch (darkmode) {
    case false:  
      colorLine = Color.black()
      break;
    case true:  
      colorLine = Color.white()
      break; 
  }
 */ colorLine = Color.black()


  switch (machine) {
    case "laundry":
      canvas.addPath(laundryPath(canvSize * 0.2, canvSize / 3, canvSize * 0.6))
      textOffset = 2
      break;
    case "dryer":
      canvas.addPath(dryerPath(canvSize * 0.26, canvSize * 0.26, canvSize * 0.48))
      textOffset = -5
      break;
  }



  canvas.setLineWidth(5)
  canvas.setStrokeColor(colorLine)
  canvas.strokePath()

  const canvTextRect = new Rect(
    0,
    (canvSize - canvTextSize) / 2 + textOffset, //imageoffset
    canvSize,
    canvSize
  )


  canvas.setTextAlignedCenter()
  canvas.setTextColor(Color.gray())
  canvas.setFont(Font.boldSystemFont(canvTextSize))

  canvas.drawTextInRect(text, canvTextRect)





  return canvas.getImage()


  function laundryPath(x, y, width) {

    let path = new Path()

    point = function (x, y) { return new Point(x, y) }

    const aspectRatio = 0.6
    const height = width * aspectRatio
    const buttomWidthRatio = 0.75
    const buttomWidth = width * buttomWidthRatio
    const buttomOffset = (width - buttomWidth) / 2
    const waveStart = 0.22
    const waveRelativeHeight = 0.125
    const waveHeight = height * waveRelativeHeight
    const waveWidth = (waveStart * buttomWidth +
      (1 - waveStart) * width)
    const waveAmount = 3
    const waveHalfWidth = waveWidth / waveAmount / 2

    path.addLines([
      point(x, y),
      point(x + buttomOffset, y + height),
      point(x + buttomWidth + buttomOffset, y + height),
      point(x + width, y)
    ])


    path.move(point(x + buttomOffset * waveStart,
      y + height * waveStart))
    //   path.addLine(point(x+width-buttomOffset*waveStart,y+height*waveStart))

    const wX = x + buttomOffset * waveStart
    const wY = y + height * waveStart

    path.move(point(wX, wY))

    for (i = 0; i < waveAmount * 2; i = i + 2) {
      path.addCurve(
        point(wX + waveHalfWidth * (i + 1), wY - waveHeight),
        point(wX + waveHalfWidth * (i + 0.5), wY),
        point(wX + waveHalfWidth * (i + 0.5), wY - waveHeight))

      path.addCurve(
        point(wX + waveHalfWidth * (i + 2), wY),
        point(wX + waveHalfWidth * (i + 1.5), wY - waveHeight),
        point(wX + waveHalfWidth * (i + 1.5), wY))
    }

    return path
  }

  function dryerPath(x, y, width) {
    let path = new Path()

    const height = width
    const cMargin = height * 0.05


    path.addRect(new Rect(x, y, width, height))
    path.addEllipse(new Rect(x + cMargin, y + cMargin,
      width - 2 * cMargin, height - 2 * cMargin))

    return path
  }
}






async function getLaundryStatus() {  
  let req = new Request("https://web.payperwash.com/PPW0107/Default.aspx")
  
  let answer = await req.loadString()
    
  const cookie = req.response["cookies"][0]["value"]
  
  console.log(cookie)
  
  req = new Request("https://web.payperwash.com/PPW0107/Default.aspx")
  
  req.method = "POST"
  
  req.headers = {"Cookie": "RCARDM5WebBoka="+cookie}
  
  console.log(req.headers)
  
  req.body = "__EVENTTARGET=ctl00%24ContentPlaceHolder1%24btOK&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUJLTY3OTUyMjQ4D2QWAmYPZBYCAgMPZBYGAgEPDxYCHgdWaXNpYmxlaGQWAmYPFQEHTG9nIGluZGQCAw9kFgICAQ9kFgoCAQ8PFgIeBFRleHQFGVBheSBwZXIgd2FzaCAtIFZpc2lvbiBXZWJkZAIDDw8WAh8BBQVOYXZuOmRkAgcPDxYCHwEFDEFkZ2FuZ3Nrb2RlOmRkAgsPDxYCHwEFB0xvZyBpbmRkZAINDw8WAh8BBQpHbGVtdCBrb2RlZGQCBQ8PFgIfAQU%2BVmVyc2lvbiAxLjIuMC4xMiBDb3B5cmlnaHQgRWxlY3Ryb2x1eCBMYXVuZHJ5IFN5c3RlbSBTd2VkZW4gQUJkZGS5l%2F9GKbyojic%2FpYLpSAwGr8ePlA%3D%3D&__VIEWSTATEGENERATOR=B39680A7&__EVENTVALIDATION=%2FwEWBgKG9o6wDAKi8%2Fy9CAKqgsX1DAKZ7b30DgKg%2BM%2FXDwLg74q7AvX7ndEnMX7WJBNqiHyK4mAlB5DM&ctl00%24MessageType=ERROR&ctl00%24ContentPlaceHolder1%24tbUsername=<email>&ctl00%24ContentPlaceHolder1%24tbPassword=<Password>"
  
  await req.loadString()
  
  req = new Request("https://web.payperwash.com/PPW0107/Machine/MachineGroupStat.aspx")
  
  req.headers = {"Cookie": "RCARDM5WebBoka="+cookie}
  
  answer = await req.loadString()
  
  
  webView = new WebView()
  //   webView.present()
  
    await webView.loadHTML(answer)
    const getData = `
          function getData(){
               a = []
               a.push (document.getElementById( "ctl00_ContentPlaceHolder1_Repeater1_ctl00_Repeater2_ctl00_MaskGrpTitle" ).innerText)
               
               a.push (document.getElementById( "ctl00_ContentPlaceHolder1_Repeater1_ctl00_Repeater2_ctl01_MaskGrpTitle" ).innerText)
  
               a.push (document.getElementById( "ctl00_ContentPlaceHolder1_Repeater1_ctl00_Repeater2_ctl02_MaskGrpTitle" ).innerText)
  
               a.push (document.getElementById( "ctl00_ContentPlaceHolder1_Repeater1_ctl00_Repeater2_ctl03_MaskGrpTitle" ).innerText)
  
               a.push (document.getElementById( "ctl00_ContentPlaceHolder1_Repeater1_ctl00_Repeater2_ctl04_MaskGrpTitle" ).innerText)
  
               a.push (document.getElementById( "ctl00_ContentPlaceHolder1_Repeater1_ctl02_Repeater2_ctl00_MaskGrpTitle" ).innerText)
  
               a.push (document.getElementById( "ctl00_ContentPlaceHolder1_Repeater1_ctl02_Repeater2_ctl01_MaskGrpTitle" ).innerText)
  
               a.push (document.getElementById( "ctl00_ContentPlaceHolder1_Repeater1_ctl02_Repeater2_ctl02_MaskGrpTitle" ).innerText)
  
               a.push (document.getElementById( "ctl00_ContentPlaceHolder1_Repeater1_ctl02_Repeater2_ctl03_MaskGrpTitle" ).innerText)
  
               a.push (document.getElementById( "ctl00_ContentPlaceHolder1_Repeater1_ctl02_Repeater2_ctl01_MaskGrpTitle" ).innerText)
  
  
               return a
        
           } 
    
        getData()  
    `
    let response = await webView.evaluateJavaScript(getData, false)
  
  
   console.log(`Response: ${response}`)
    
  return calcProgress(response)


  function calcProgress(input) {

    let machines = { wash: [], dryer: [] }  
    let progress = 0
    for (i = 0; i < input.length; i++) {
      progress = 70
      if (input[i].includes("Ledig")) {
        progress = 101
      } 
      

      if (input[i].includes("WASH") || input[i].includes("VASK")) {
        machines.wash.push(progress)
      } else if (input[i].includes("DRYER") || input[i].includes("TUMBLER")  || input[i].includes("TØRRE")){
        machines.dryer.push(progress)
      }

    }
    console.log(`Wash: ${machines.wash} ; Dryer: ${machines.dryer}`)
    return machines
  }
    
}
