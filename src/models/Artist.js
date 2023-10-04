import firebase from '../firebaseConfig';
import Project from '../models/Project';
import Helpers from '../Helpers';

class Artist {
    // Constructor that initializes the properties of the artist
    constructor(id, name) {
        this.id = id;
        this.name = name; 
    }

    static async getArtistById(artistId) {
        const snapshot = await firebase.database()
            .ref("artists").child(artistId).once("value");
        const artist = snapshot.val();
        return new Artist(artistId, artist.metadata.name);
    }

    async getSnapshotOfProjects() {
        const snapshot = await firebase.database().ref("artists").child(this.id)
            .child("projects").once("value");
        const projects = snapshot.val();
        return Object.entries(projects).map((([key, value]) => {
            const metadata = value.metadata;
            const albumArtId = metadata["album art"];
            if (albumArtId != null) {
                const albumArt = value.art[albumArtId];
                const albumArtURL = albumArt.metadata["remote url"];
                return new Project(
                    key,
                    this.id,
                    metadata.name,
                    albumArtURL,
                    metadata["track count"],
                    Helpers.formatDuration(metadata["duration"]));
            } else {
                return new Project(
                    key,
                    this.id,
                    metadata.name,
                    null,
                    metadata["track count"],
                    Helpers.formatDuration(metadata["duration"]));
            }
        }));
    }
}

export default Artist;