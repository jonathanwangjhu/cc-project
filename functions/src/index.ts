import * as functions from 'firebase-functions';

// Firebase
import * as admin from 'firebase-admin';
admin.initializeApp();

// Cloud Vision
var vision = require('@google-cloud/vision');
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
			const faces = results.faceAnnotations;

			return docRef.set(faces)   
		} else {
			return;
		}        
});