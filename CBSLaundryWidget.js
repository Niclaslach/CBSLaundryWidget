// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
//////// Settings /////////
const thresholds = {
  amber: 60,
  green: 100
}

const dorm = "Nimbusparken" // Copy your dorm: Porcelaenshaven, Holger Danske Kollegiet, Nimbusparken, Kathrine kollegiet


let dorm_ip = ""

switch (dorm) {
  case "Porcelaenshaven":
    dorm_ip = "http://77.75.166.66/Status.asp"
    break;

  case "Holger Danske Kollegiet":
    dorm_ip = "http://95.209.150.175/Status.asp"
    break;

  case "Nimbusparken":
    dorm_ip = "http://77.75.160.131/Status.asp"
    break;

  case "Kathrine kollegiet":
    dorm_ip = "http://95.209.150.208/Status.asp"
    break;

  default:
    throw new Error("Dorm unknown");
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
  // Show the medium widget inside the app
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
    if (index % 4 == 0 && index > 0) {
      washStacks.push(listwidget.addStack())
    }
    washStacks[Math.floor(index/4)].addImage(getDiagram(machine, String(index + 1), "laundry"));
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
  const req = new Request(dorm_ip)

  req.headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
    "upgrade-insecure-requests": "1"
  }

  const answer = await req.loadString()
  // 
  if (loginCredentials.length == 2) {
    let loginReq = new Request("http://77.75.166.66/aLog.asp")
    loginReq.method = "POST"
    loginReq.headers = {
      'Cookie': req.response.headers["Set-Cookie"]
    };
    loginReq.body = `username=${loginCredentials[0]}&password=${loginCredentials[1]}`
    loginReq.load()

    let balanceReq = new Request("http://77.75.166.66/Saldo.asp")
    balanceReq.headers = loginReq.headers
    balanceSite = await balanceReq.loadString()
    let balanceIndex = balanceSite.indexOf("Balance")
    balance = balanceSite.slice(balanceIndex, balanceIndex + 50).split("&nbsp;")[1]

    console.log(balanceSite)
    balance = (balance + "kr.").replace(",", ".").slice(0, -1)
    try {
      //     balance = balance.replace(",", ".") + 'kr';
    } catch (err) {
      balance = "error";
    }
  }


  webView = new WebView()

  await webView.loadHTML(answer)
  const getData = `
        function getData(){
             a = []
             x = document.getElementsByClassName("noborder")
             for(s of x){
                 a.push(s.innerText)
             }
             return a
      
         } 
  
      getData()  
  `
  let response = await webView.evaluateJavaScript(getData, false)



  console.log(`Response: ${response}`)

  return calcProgress(response)


  function calcProgress(input) {
    input = input.slice(2)

    let machines = { wash: [], dryer: [] }
    let progress = 0
    for (i = 0; i < input.length; i = i + 5) {
      progress = 0
      if (input[i + 2] == "Ready") {
        progress = 101
      } else {

        let startTime = input[i + 4].split(" ")[1].split(":")
        console.log(startTime)
        let now = new Date
        var percent = Math.min(((now.getHours() - startTime[0]) * 60 + now.getMinutes() - startTime[1]) / 70 * 100, 90)
        console.log(percent)
        progress = percent
      }

      if (input[i].includes("WASH") || input[i].includes("VASK")) {
        machines.wash.push(progress)
      } else if (input[i].includes("DRYER") || input[i].includes("TUMBLER")) {
        machines.dryer.push(progress)
      }

    }
    console.log(`Wash: ${machines.wash} ; Dryer: ${machines.dryer}`)
    return machines
  }
}

