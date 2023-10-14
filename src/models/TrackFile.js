import uuid from 'react-native-uuid';
import firebase from '../firebaseConfig';
import Track from './Track';

class TrackFile {
    constructor(file, project) {
        this.trackId = uuid.v4();
        this.revId = uuid.v4();
        this.file = file;
        this.fileURL = URL.createObjectURL(file);

        if (file.name.includes('.')) {
            this.name = file.name.substring(0, file.name.lastIndexOf('.'));
        } else {
            this.name = file.name;
        }

        // Extract file type (extension)
        this.fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
        this.size = file.size;
        this.lastModified = file.lastModified;
        this.project = project;
        this.uploadingProgress = 0;
    }

    async asTrack() {
        const duration = await this.getDuration();
        return new Track(
            this.trackId, 
            this.revId, 
            this.name, 
            duration, 
            this.fileURL, 
            10, 
            false,
            this.project
        )
    }

    // Generates the track metadata for uploading
    async getTrackMetadata() {
        return this.getDuration().then((duration) => {
            var data = {
                artistId: this.project.artist.id,
                projectId: this.project.id,
                lastModified: this.lastModified,
                revId: this.revId,
                name: this.name,
                fileType: this.fileType,
                duration: duration,
                size: this.size,
                uId: firebase.auth().currentUser.uid,
            }
            const getMetadata = firebase.functions().httpsCallable("getTrackMetadata");
            return getMetadata(data);
        }).then((result) => {
            return result.data.data;
        })
    }

    getDuration() {
        return new Promise((resolve, reject) => {
            const audioElement = new Audio(this.fileURL);
            
            audioElement.addEventListener("loadedmetadata", function() {
                const duration = audioElement.duration;
                resolve(duration);
            });

            audioElement.onerror = () => {
                reject(new Error("Failed to load the audio file."));
            };
        });
    }

    upload(progressCallback) {
        const storageRef = firebase.storage().ref("audio").child(this.revId);
        const uploadToken = firebase.functions().httpsCallable("uploadToken");
        const currUserId = firebase.auth().currentUser.uid;
        progressCallback(this.trackId, 0);
        uploadToken({ "uId": currUserId, "path": this.file }).then((result) => {
            return result.data.token;
        }).then((token) => {
            return firebase.auth().signInWithCustomToken(token);
        }).then((_) => {
            const uploadTask = storageRef.put(this.file);
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Handle the progress update
                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    progressCallback(this.trackId, progress);
                }, 
                (error) => {
                    // Handle unsuccessful uploads here
                    progressCallback(this.trackId, 500);
                    console.error('Error uploading file:', error);
                }, 
                () => {
                    // Upload done!!
                    progressCallback(this.trackId, 200);
                }
            );
            return uploadTask;
        }).then(() => {
            return storageRef.getDownloadURL();
        }).then((downloadURL)=> {
            return Promise.all([Promise.resolve(downloadURL), this.getTrackMetadata()]);
        }).then(response => {
            var downloadURL = response[0];
            var metadata = response[1];
            metadata["revisions"][this.revId]["metadata"]["remote url"] = downloadURL; // Set the storage URL
            return firebase.database().ref("artists").child(this.project.artist.id).child("projects")
                .child(this.project.id).child("tracks").child(this.trackId).set(metadata);
        }).catch((err) => {
            alert("Please upgrade your storage plan from the Demodeck app.")
            console.error(err);
        });
    }
}

export default TrackFile;