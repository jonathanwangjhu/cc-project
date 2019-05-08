import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';

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

  emotionPositions: [[string, string], [string, string], [string, string], [string, string]] = [['0', '0'], ['0', '0'], ['0', '0'], ['0', '0']];

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

  async startUpload(file: string) {
    // const timestamp = new Date().getTime().toString();
    const docId = this.afs.createId();
    const path = `${docId}.jpg`;

    // Make a reference to the future location of the firestore document
    const photoRef = this.afs.collection('photos').doc(docId)
    
    // Firestore observable, ignore when return is null
    this.firebaseResult = photoRef.valueChanges().pipe(
      filter(data => !!data), 
      map(data => {

        const emotion0 = this.getLikelyEmotion(data["0"])
        this.setEmotionPosition(data["0"], 0)

        const emotion1 = this.getLikelyEmotion(data["1"])
        this.setEmotionPosition(data["1"], 1)

        const emotion2 = this.getLikelyEmotion(data["2"])
        this.setEmotionPosition(data["2"], 2)

        const emotion3 = this.getLikelyEmotion(data["3"])
        this.setEmotionPosition(data["3"], 3)

        return {"faces": [emotion0, emotion1, emotion2, emotion3]}
    }));

    const image = 'data:image/jpg;base64,' + file;
    this.task = this.storage.ref(path).putString(image, 'data_url'); 
  }

  getLikelyEmotion(face: {}) : string {
    if (!face) {
      return "none"
    }

    const anger = 0 + +(face["anger"] == "VERY_UNLIKELY") + +(face["anger"] == "UNLIKELY") * 2 + +(face["anger"] == "LIKELY") * 3 + +(face["anger"] == "VERY_LIKELY") * 4
    const joy = 0 + +(face["joy"] == "VERY_UNLIKELY") + +(face["joy"] == "UNLIKELY") * 2 + +(face["joy"] == "LIKELY") * 3 + +(face["joy"] == "VERY_LIKELY") * 4
    const sorrow = 0 + +(face["sorrow"] == "VERY_UNLIKELY") + +(face["sorrow"] == "UNLIKELY") * 2 + +(face["sorrow"] == "LIKELY") * 3 + +(face["sorrow"] == "VERY_LIKELY") * 4
    const surprise = 0 + +(face["surprise"] == "VERY_UNLIKELY") + +(face["surprise"] == "UNLIKELY") * 2 + +(face["surprise"] == "LIKELY") * 3 + +(face["surprise"] == "VERY_LIKELY") * 4

    let mostLikely = "none"
    let likeliness = 0

    if (anger > likeliness) {
      likeliness = anger
      mostLikely = "anger"
    }

    if (joy > likeliness) {
      likeliness = joy
      mostLikely = "joy"
    }

    if (sorrow > likeliness) {
      likeliness = sorrow
      mostLikely = "sorrow"
    }

    if (surprise > likeliness) {
      likeliness = surprise
      mostLikely = "surprise"
    }

    return mostLikely
  }

  setEmotionPosition(face: {}, index: number) {
    if (!face) {
      return
    }
    const vertices = [face["v1"], face["v2"], face["v3"], face["v4"]]

    if (+vertices[0]["x"] > 200 && +vertices[3]["x"] > 200) {
      this.emotionPositions[index] = [+vertices[0]["x"] - 200 + "px", (+vertices[0]["y"] + +(vertices[3]["y"])) / 2 + "px"]
    } else {
      this.emotionPositions[index] = [+vertices[1]["x"] + 60 + "px", (+vertices[1]["y"] + +(vertices[2]["y"])) / 2 + "px"]
    }

    console.log(this.emotionPositions)
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
    quality: 10
  }

  // placeholder for photo
  picture = '';

  // take a picture
  async takePicture() {
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
      this.startUpload(imageData);
    }, (err) => {
      console.log(err);
      this.picture = 'assets/img/test.jpg';
    });
  }
}
