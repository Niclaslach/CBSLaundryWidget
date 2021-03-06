# CBS Laundry Widget

This project creates an iOS widget to **monitor washing machines and dryers** in all CBS dorms using the [Scriptable App](https://scriptable.app).  
Moreover, the widget lets users check their **current balance of their laundry tag**.  
<img src="images/ExamplePicture.png" width=200>

### Features
- See the status of laundry machines and dryers
- Colour encoding quickly shows the status of the machines
  - Red: *In use*
  - Yellow: *Soon to finish*
  - Green: *Machine ready / finished*
- Rings show progress of each machine
- Display current balance of your laundr tag

**All features are also explained in the graphic below:**
<p align="center">
 <img src="images/Explanation.jpg" width=600>
</p>



## Install the Widget

1. [Download Scriptable on the iOS App Store](https://apps.apple.com/us/app/scriptable/id1405459188?uo=4)
2. Create a new script inside Scriptable.
3. Rename the script by clicking on its name in the top.
  *(You might skip this step :stuck_out_tongue_winking_eye:)*
4. Copy the code for you dorm from [**HERE**](https://www.niclaslach.de/copyCBSLaundryWidgetCode) into the empty script.  
Options are:  
   - Porcelaenshaven
   - Holger Danske Kollegiet
   - Nimbusparken
   - Kathrine kollegiet  

   The file you are copying can be found under [CBSLaundryWidget.js](https://github.com/Niclaslach/CBSLaundryWidget/blob/main/CBSLaundryWidget.js).  
 
5. Add the Scriptable widget to your homescreen (hold on an app until it shakes and click the "+" button on the upper left corner).  
The suggested size is small.
6. Click on the newly created widget and select the newly created script.  
<img src="images/WidgetConfiguration.jpg" width=300>

7. **Optional:** Under Parameter enter your username and password to see your current Saniva balance.  
The format should be *\<username\>;\<password\>*  
*Example: 123;0000*
8. **Optional:** Change the setting *When Interacting* from *Open App* to *Run Script* to update the widget by clicking on it.

<br>

## More Information

The variable *dorm* determines the dorm displayed. Insert your dorm name (in quotes, spelling important). Options are:  
   - Porcelaenshaven
   - Holger Danske Kollegiet
   - Nimbusparken
   - Kathrine kollegiet  
  
  The script available on the website [**https://www.niclaslach.de/copyCBSLaundryWidgetCode**](https://www.niclaslach.de/copyCBSLaundryWidgetCode) changes this value automatically.   
  <img src="images/ChooseDorm.png" width=300>

