import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';

import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore} from 'angularfire2/firestore';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // has the camera finished starting up
  cameraStarted = false
  // Upload task
  task: AngularFireUploadTask;
  // Firestore data
  firebaseResult: Observable<any>;
  image: string;

  constructor(private storage: AngularFireStorage, 
              private afs: AngularFirestore, 
              private cameraPreview: CameraPreview) { }

  ionViewDidEnter() {
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
      (res) => {
        this.cameraStarted = true
        console.log(res)
        console.log("started!!!")
      },
      (err) => {
        this.cameraStarted = true
        console.log(err)
        console.log('ripppppp :(')
      });
  }

  /*async gcpRequest(fileName : String) {
  	// Imports the Google Cloud client library
	const vision = require('@google-cloud/vision');

	// Creates a client
	const client = new vision.ImageAnnotatorClient();

	const [result] = await client.faceDetection(fileName);
	const faces = result.faceAnnotations;
	console.log('Faces:');
	faces.forEach((face, i) => {
	  console.log(`  Face #${i + 1}:`);
	  console.log(`    Joy: ${face.joyLikelihood}`);
	  console.log(`    Anger: ${face.angerLikelihood}`);
	  console.log(`    Sorrow: ${face.sorrowLikelihood}`);
	  console.log(`    Surprise: ${face.surpriseLikelihood}`);
	});
  }*/

  startUpload(file: string) {
    // const timestamp = new Date().getTime().toString();
    const docId = this.afs.createId();
    const path = `${docId}.jpg`;

    // Make a reference to the future location of the firestore document
    const photoRef = this.afs.collection('photos').doc(docId)
    
    // Firestore observable, ignore when return is null
    this.firebaseResult = photoRef.valueChanges().pipe(filter(data => !!data));

    this.image = 'data:image/jpg;base64,' + file;
    this.task = this.storage.ref(path).putString(this.image, 'data_url'); 
  }

  // camera options (Size and location). In the following example, the preview uses the rear camera and display the preview in the back of the webview
  cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height,
    camera: 'rear',
    tapPhoto: false,
    previewDrag: false,
    toBack: true,
    alpha: 1
  }

  // picture options
  pictureOpts: CameraPreviewPictureOptions = {
    width: 1080,
    height: 1920,
    quality: 100
  }

  // placeholder for photo
  picture = '';

  // take a picture
  takePicture() {
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
      this.startUpload(imageData);
    }, (err) => {
      console.log(err);
      this.picture = 'assets/img/test.jpg';
    });
  }

  // Switch camera
  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  // set color effect to negative
  setColorEffect() {
    this.cameraPreview.setColorEffect('negative');
  }

  // Stop the camera preview
  stopCamera() {
    this.cameraPreview.stopCamera();
  }
}
