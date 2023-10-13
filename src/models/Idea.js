import firebase from '../firebaseConfig';

class Idea {
    constructor (id, name) {
        this.id = id;
        this.name = name || "Untitled";
    }

    static async getIdeaById(artistId, projectId, ideaId) {
        const dbRef = firebase.database().ref("artists").child(artistId)
            .child("projects").child(projectId).child("ideas").child(ideaId);

        const deletedDbRef = firebase.app("deletedData").database().ref("artists")
            .child(artistId).child("projects").child(projectId).child("ideas").child(ideaId);

        let snapshot = await dbRef.once("value");
        if (!snapshot.exists()) {
            snapshot = await deletedDbRef.once("value");
        }

        if (!snapshot.exists()) {
            // Project not found in either database
            throw new Error("Project not found");
        }

        const idea = snapshot.val();
        const metadata = idea.metadata;
        return new Idea(ideaId, metadata.name);
    }
}

export default Idea;