import firebase from '../firebaseConfig';
import Project from './Project';

class Track {
    constructor(id, currRevId, name, duration, audioUrl, orderWeight, isLocked, project) {
        this.id = id;
        this.currRevId = currRevId;
        this.name = name || "Untitled";
        this.duration = duration;
        this.audioUrl = audioUrl;
        this.orderWeight = orderWeight;
        this.isLocked = isLocked;
        this.project = project;
    }

    static async getTrackById(artistId, projectId, trackId) {
        const dbRef = firebase.database().ref("artists").child(artistId)
            .child("projects").child(projectId).child("tracks").child(trackId);

        const deletedDbRef = firebase.app("deletedData").database().ref("artists").child(artistId)
            .child("projects").child(projectId).child("tracks").child(trackId);

        let snapshot = await dbRef.once("value");
        if (!snapshot.exists()) {
            snapshot = await deletedDbRef.once("value");
        }

        if (!snapshot.exists()) {
            // Track not found in either database
            throw new Error("Track not found");
        }

        const track = snapshot.val();
        const metadata = track.metadata;
        const currentRevisionId = metadata["current revision"];
        const currentRevision = track.revisions[currentRevisionId].metadata;

        const project = await Project.getProjectById(artistId, projectId);
        
        return new Track(
            trackId, 
            currentRevisionId,
            metadata.name, 
            currentRevision.duration,
            currentRevision["remote url"],
            metadata["order weight"],
            metadata["locked"] === true ? true : false,
            project
        );
    }
}

export default Track;