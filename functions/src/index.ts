import * as functions from 'firebase-functions';

// Firebase
import * as admin from 'firebase-admin';
admin.initializeApp();

// Cloud Vision
const vision = require('@google-cloud/vision');
const visionClient =  new vision.ImageAnnotatorClient();

// Dedicated bucket for cloud function invocation
const bucketName = 'cloud-computing-235700-vision';

export const imageTagger = functions.storage
	.bucket(bucketName)
	.object()
	.onFinalize(async (object, context) => {
		const filePath = object.name;   

		// Location of saved file in bucket
		const imageUri = `gs://${bucketName}/${filePath}`;

		if(filePath) {
			const docId = filePath.split('.jpg')[0];

			const docRef  = admin.firestore().collection('photos').doc(docId);

			// Await the cloud vision response
			const results = await visionClient.faceDetection(imageUri);
			const rewFaces = results[0].faceAnnotations;
			let faces: {[k: string]: any} = {};

			rewFaces.forEach((face: any, i: number) => {
				const newFace = {
					"face": i + 1,
					"joy": face.joyLikelihood,
					"anger": face.angerLikelihood,
					"sorrow": face.sorrowLikelihood,
					"surprise": face.surpriseLikelihood,
					"v1": face.boundingPoly.vertices[0],
					"v2": face.boundingPoly.vertices[1],
					"v3": face.boundingPoly.vertices[2],
					"v4": face.boundingPoly.vertices[3]
				}

				faces[i] = newFace
			});

			console.log(faces)
			return docRef.set(faces)   
		} else {
			console.log("error!")
			return;
		}        
});