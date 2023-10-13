import Track from './Track';
import Idea from './Idea';
import User from './User';
import firebase from '../firebaseConfig';

class Activity {
    constructor(id, metadata, notificationType, timeCreated, project, senderName) {
        this.id = id;
        this.metadata = metadata;
        this.notificationType = notificationType;
        this.timeCreated = timeCreated;
        this.project = project;
        this.senderName = senderName;
    }

    trackActivity = [
        "added-track", 
        "deleted-track", 
        "renamed-track",
        "added-revision-track",
        "deleted-revision-track",
        "changed-revision-track",
        "commented-track",
        "shared-track",
    ];

    ideaActivity = [
        "added-idea", 
        "deleted-idea", 
        "renamed-idea",
        "shared-idea",
    ];

    artActivity = [
        "added-art",
        "deleted-art"
    ];

    projectActivity = [
        "added-project",
        "deleted-project",
        "renamed-project",
        "added-project-album-art",
        "updated-project-album-art",
        "removed-project-album-art",
        "shared-project",
    ]

    getSenderName() {
        if (this.metadata.senderId === firebase.auth().currentUser.uid) {
            return "You"
        } else {
            return this.senderName;
        }
    }

    async getLabel() {
        if (this.trackActivity.includes(this.notificationType)) {
            const label = await this.getLabelForTrackActivity();
            return label;
        } else if (this.ideaActivity.includes(this.notificationType)) {
            const label = await this.getLabelForIdeaActivity();
            return label;
        } else if (this.artActivity.includes(this.notificationType)) {
            const label = await this.getLabelForArtActivity();
            return label;
        } else if (this.projectActivity.includes(this.notificationType)) {
            const label = await this.getLabelForProjectActivity();
            return label;
        }  else {
            return this.notificationType;
        }
    }

    async getLabelForArtActivity() {
        switch (this.notificationType) {
            case "added-art":
                return `${this.getSenderName()} added art to ${this.project.name}`;
            case "deleted-art":
                return `${this.getSenderName()} deleted art from ${this.project.name}`;
            default:
                return this.notificationType;
        }
    }

    async getLabelForTrackActivity() {
        const artistId = this.metadata["artistId"];
        const projectId = this.metadata["projectId"];
        const trackId = this.metadata["trackId"];
        const track = await Track.getTrackById(artistId, projectId, trackId);
        switch (this.notificationType) {
        case "added-track":
            return `${this.getSenderName()} added a new track to ${this.project.name}: ${track.name}`; 
        case "deleted-track":
            return `${this.getSenderName()} deleted a track from ${this.project.name}: ${track.name}`;
        case "renamed-track":
            return `${this.getSenderName()} renamed a track from ${this.metadata["prevName"]} to ${this.metadata["newName"]}`;
        case "added-revision-track":
            return `${this.getSenderName()} added a new version to ${track.name}`;
        case "deleted-revision-track":
            return `${this.getSenderName()} deleted a version from ${track.name}`;
        case "changed-revision-track":
            return `${this.getSenderName()} changed the current version of ${track.name}`;
        case "shared-track":
            const sharedWithId = this.metadata["sharedWithId"];
            const sharedWithUser = await User.getUserName(sharedWithId);
            return `${this.getSenderName()} shared the track ${track.name} with ${sharedWithUser}`;
        case "commented-track":
            return `${this.getSenderName()} commented on the track ${track.name}: ${this.metadata["commentRawString"]}`;
        default:
            return this.notificationType;
        }
    }

    async getLabelForIdeaActivity() {
        const artistId = this.metadata["artistId"];
        const projectId = this.metadata["projectId"];
        const ideaId = this.metadata["ideaId"];
        const projectName = this.project.name;
        const idea = await Idea.getIdeaById(artistId, projectId, ideaId);
        switch (this.notificationType) {
            case "added-idea":
                return `${this.getSenderName()} added a new idea to ${projectName}: ${idea.name}`;
            case "deleted-idea":
                return `${this.getSenderName()} deleted an idea from ${projectName}: ${idea.name}`;
            case "renamed-idea":
                return `${this.getSenderName()} renamed an idea from ${this.metadata["prevName"]} to ${this.metadata["newName"]}`;
            case "shared-idea":
                const sharedWithId = this.metadata["sharedWithId"];
                const sharedWithUser = await User.getUserName(sharedWithId);
                return `${this.getSenderName()} shared the idea ${idea.name} with ${sharedWithUser}`;
            default:
                return "DEFAULT";
        }
    }

    async getLabelForProjectActivity() {
        const projectName = this.project.name;
        
        switch (this.notificationType) {
            case "added-project":
                return `${this.getSenderName()} created the project ${projectName}`;
            case "deleted-project":
                return "DELETED PROJECT";
            case "renamed-project":
                return `${this.getSenderName()} renamed the project from ${this.metadata["prevName"]} to ${this.metadata["newName"]}`;
            case "added-project-album-art":
                return `${this.getSenderName()} added album art to ${projectName}`;
            case "updated-project-album-art":
                return `${this.getSenderName()} updated the album art for ${projectName}`;
            case "removed-project-album-art":
                return `${this.getSenderName()} removed the album art from ${projectName}`;
            case "shared-project":
                const sharedWithId = this.metadata["sharedWithId"];
                const sharedWithUser = await User.getUserName(sharedWithId);
                return `${this.getSenderName()} shared the project ${projectName} with ${sharedWithUser.name}`;
            default:
                return this.notificationType;
        }
    }

    /**
     * Fetches a snapshot of activities associated with the current instance.
     * 
     * @async
     * @function
     * @param {number} Z - The maximum number of activities to fetch. If set to -1, all activities will be fetched.
     * @returns {Promise<Array>} Returns a promise that resolves to an array of resolved activities.
     * @throws {Error} Throws an error if unable to fetch the snapshot or any other underlying error.
     * 
     * @example
     * 
     * const activities = await instanceOfYourClass.getSnapshotOfActivity(5);  // Fetches up to 5 activities.
     * const allActivities = await instanceOfYourClass.getSnapshotOfActivity(-1);  // Fetches all activities.
    */
    static async getActivityById(activityId) {
        const snapshot = await firebase.database().ref("activity").child(activityId).once("value");
        const activity = snapshot.val();
        const senderId = activity.metadata.senderId;
        const name = await User.getUserName(senderId);
        return new Activity(
            activityId, 
            activity["metadata"], 
            activity["notification type"], 
            activity["time created"],
            null,
            name
        );
    }
}

export default Activity;