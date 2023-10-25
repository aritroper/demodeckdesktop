import firebase from '../firebaseConfig';
import Project from '../models/Project';

class Artist {
    // Constructor that initializes the properties of the artist
    constructor(id, name, members) {
        this.id = id;
        this.name = name || "Unnamed Artist"; 
        this.members = members;
    }

    static async getArtistById(artistId) {
        const snapshot = await firebase.database()
            .ref("artists").child(artistId).child("metadata").once("value");
        const artist = snapshot.val();
    
        let members;
        try {
            const membersSnapshot = await firebase.database().ref("artists")
                .child(artistId).child("members").once("value");
            members = Object.keys(membersSnapshot.val() || {});  // Using Object.keys to get the dictionary keys
        } catch (error) {
            console.error("Error fetching members:", error);
            members = [];  // If permission is denied or any other error, set members as an empty list
        }
        
        return new Artist(artistId, artist.name, members);
    }

    /**
     * Returns the initials of the artist name. 
     * Each word's first character is taken to form the initials.
     * 
     * @param {string} name - The full name from which to derive the initials.
     * @returns {string} The initials derived from the name, in uppercase.
     * 
     * @example
     * // returns "JD"
     * getInitials("John Doe");
     * 
     * @example
     * // returns "ABC"
     * getInitials("Alice Bob Charlie");
     */
    getInitials() {
        const words = this.name.split(' ');
        const initials = words.map(word => word.charAt(0)).join('');
        return initials.toUpperCase();
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
                    metadata["duration"],
                    this,
                );
            } else {
                return new Project(
                    key,
                    this.id,
                    metadata.name,
                    null,
                    metadata["track count"],
                    metadata["duration"],
                    this,
                );
            }
        }));
    }
}

export default Artist;