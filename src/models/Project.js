import firebase from '../firebaseConfig';
import Track from './Track';
import Helpers from '../Helpers';

class Project {
    // Constructor that initializes the properties of the project
    constructor(id, artistId, title, imageUrl, numberOfTracks, duration) {
        this.id = id;
        this.artistId = artistId;
        this.title = title;             // The title of the project
        this.imageUrl = imageUrl;       // The URL of the project's image
        this.numberOfTracks = numberOfTracks; // The number of tracks in the project
        this.duration = duration;
    }

    // Method to display the project's details (this is optional, but might be useful)
    displayDetails() {
        console.log(`Title: ${this.title}`);
        console.log(`Image URL: ${this.imageUrl}`);
        console.log(`Number of Tracks: ${this.numberOfTracks}`);
    }

    getFirebaseRef() { 
        return firebase.database().ref("artists").child(this.artistId)
            .child("projects").child(this.id);
    }

    async getSnapshotOfTracks() {
        const snapshot = await this.getFirebaseRef().child("tracks").once("value");
        const tracks = snapshot.val();
        
        return Object.entries(tracks).map(([key, value]) => {
            const metadata = value.metadata;
            const currentRevisionId = value.metadata["current revision"];
            const currentRevision = value.revisions[currentRevisionId].metadata;
            return new Track(
                key, 
                metadata.name, 
                Helpers.formatDuration(currentRevision.duration), 
                currentRevision["remote url"]
            );
        });
    }
}

export default Project;