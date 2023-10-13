
class Helpers {
    static deletedDataURL = "https://demodeck-deleted-data.firebaseio.com";

    static formatDuration(seconds) {
        // Convert the total seconds into whole minutes and remaining seconds
        let minutes = Math.floor(seconds / 60);
        let remainderSeconds = Math.floor(seconds % 60);
    
        // Format the remainderSeconds to ensure it always has two digits
        let formattedSeconds = remainderSeconds < 10 ? '0' 
            + remainderSeconds : remainderSeconds;
    
        return `${minutes}:${formattedSeconds}`;
    }
}

export default Helpers;