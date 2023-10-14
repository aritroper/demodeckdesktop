import firebase from '../firebaseConfig';
import Track from './Track';
import Activity from './Activity';
import Artist from './Artist';

class Project {
    // Constructor that initializes the properties of the project
    constructor(id, artistId, name, imageUrl, numberOfTracks, duration, artist) {
        this.id = id;
        this.artistId = artistId;
        this.name = name || "Untitled";               // The name of the project
        this.imageUrl = imageUrl;       // The URL of the project's image
        this.numberOfTracks = numberOfTracks; // The number of tracks in the project
        this.duration = duration;
        this.artist = artist;
    }

    // Method to display the project's details (this is optional, but might be useful)
    displayDetails() {
        console.log(`Title: ${this.name}`);
        console.log(`Image URL: ${this.imageUrl}`);
        console.log(`Number of Tracks: ${this.numberOfTracks}`);
    }

    getFirebaseRef() { 
        return firebase.database().ref("artists").child(this.artistId)
            .child("projects").child(this.id);
    }

    static async getProjectById(artistId, projectId) {
        const dbRef = firebase.database().ref("artists").child(artistId)
            .child("projects").child(projectId);

        const deletedDbRef = firebase.app("deletedData").database().ref("artists")
            .child(artistId).child("projects").child(projectId);

        let snapshot = await dbRef.once("value");
        if (!snapshot.exists()) {
            snapshot = await deletedDbRef.once("value");
        }

        if (!snapshot.exists()) {
            // Project not found in either database
            throw new Error("Project not found");
        }

        const project = snapshot.val();
        const metadata = project.metadata;
        const albumArtId = metadata["album art"];

        const artist = await Artist.getArtistById(artistId);

        if (albumArtId != null) {
            const albumArt = project.art[albumArtId];
            const albumArtURL = albumArt.metadata["remote url"];
            return new Project(
                projectId,
                this.id,
                metadata.name,
                albumArtURL,
                metadata["track count"],
                metadata["duration"],
                artist
            );
        } else {
            return new Project(
                projectId,
                this.id,
                metadata.name,
                null,
                metadata["track count"],
                metadata["duration"],
                artist
            );
        }
    }

    async getSnapshotOfTracks() {
        const snapshot = await this.getFirebaseRef().child("tracks").once("value");
        const tracks = snapshot.val();
        
        if (!tracks) return []; // Return empty list if tracks don't exist
    
        return Object.entries(tracks).map(([key, value]) => {
            const metadata = value.metadata;
            const currentRevisionId = metadata["current revision"];
            const currentRevision = value.revisions[currentRevisionId].metadata;
            return new Track(
                key, 
                currentRevisionId,
                metadata.name, 
                currentRevision.duration,
                currentRevision["remote url"],
                metadata["order weight"],
                metadata["locked"] === true ? true : false,
                this
            );
        }).sort((a, b) => a.orderWeight - b.orderWeight);  // Fixed the sorting logic as well
    }

    async getSnapshotOfActivity(Z = -1) {
        let query = this.getFirebaseRef().child("activity").orderByChild("time created");
    
        // If Z is not -1, limit the results to the last Z items
        if (Z !== -1) {
            query = query.limitToLast(Z);
        }
    
        const snapshot = await query.once("value");
        const activity = snapshot.val();
    
        const activityPromises = Object.keys(activity).map(async key => {
            const activityDetails = await Activity.getActivityById(key);
            activityDetails.project = this;
            return activityDetails;
        });
    
        const resolvedActivities = await Promise.all(activityPromises);
        return resolvedActivities.reverse();
    }
}

export default Project;