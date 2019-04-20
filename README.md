# cc-project


## Setup for Checkpoint 1

* make sure you have `pip` installed on your computer and the most recent version of `setuptools` (`pip install --upgrade setuptools`)
* `pip install --upgrade google-cloud-vision`

To run the client library, you must first set up authentication by creating a service account and setting an environment variable:

* [Create service account key](https://console.cloud.google.com/apis/credentials/serviceaccountkey)
	* From the Service account list, select New service account.
	* In the Service account name field, enter a name.
	* Don't select a value from the Role list. No role is required to access this service.
	* Click Create. A note appears, warning that this service account has no role.
	* Click Create without role. A JSON file that contains your key downloads to your computer.

Provide authentication credentials to your application code by setting the environment variable `GOOGLE_APPLICATION_CREDENTIALS`. Replace `[PATH]` with the file path of the JSON file that contains your service account key. This variable only applies to your current shell session, so if you open a new session, set the variable again:

* On mac this woule be `export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"` where `[PATH]` is replaced with the file path of the json file.
	* For example `GOOGLE_APPLICATION_CREDENTIALS="/Users/user/Downloads/CloudComputing-ee291af30b6b.json""`
	* Tip: We found that removing any spaces from the file name solved `File not found` errors.

* Run scripts `face_detection` with `python face_detection` and `emotion_detection` with `python emotion_detection` to see if your setup is working correctly.

Setup adapted from [google](https://cloud.google.com/vision/docs/libraries).

## Setup for Checkpoint 2
* make sure you have `npm` installed on your computer and XCode.
* `npm install -g ionic`

* To compile our app and get it ready to deploy onto an iOS device, clone our repo and `cd` into the 'vision' directory. 
* Open XCode, and click on 'Open', and open the directory ios in vision > platforms. 
* Then, enter `ionic cordova prepare ios`
* Once it's done compiling, select your iOS device next to the play button on the top left, and then press play. 
