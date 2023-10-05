class Track {
    constructor(id, name, duration, audioUrl, orderWeight, project) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.audioUrl = audioUrl;
        this.orderWeight = orderWeight;
        this.project = project;
    }
}

export default Track;