import { Component } from '@angular/core';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';
import * as config from 'config.json';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private cameraPreview: CameraPreview) { }
  cameraStarted = false

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

    console.log((<any>config).project_id)
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
    width: 1280,
    height: 1280,
    quality: 85,
  }

  // placeholder for photo
  picture = '';

  // take a picture
  takePicture() {
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
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
