import firebase from '../firebaseConfig';

class User {
    constructor(id, firstName, lastName) {
        this.id = id;
        this.firstName = firstName;     
        this.lastName = lastName; 
    }

    static async getUserById(userId) {
        const snapshot = await firebase.database().ref("users").child(userId).once("value");
        const user = snapshot.val();
        return new User(userId, user.metadata["first name"], user.metadata["last name"]);
    }

    static async getUserName(userId) {
        const user = await User.getUserById(userId);
        return user.firstName + " " + user.lastName[0];
    }

    static async getUserInitials(userId) {
        const user = await User.getUserById(userId);
        return user.firstName[0] + user.lastName[0];
    }
}

export default User;