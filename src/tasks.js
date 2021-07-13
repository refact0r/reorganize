import firebase from 'firebase/app';
import { db } from './firebase';

// create a task
export function createTask(userId, name) {
    if (name) {
        db.collection("tasks")
            .add({
                uid: userId,
                list_id: "",
                name: name,
                completed: false,
                created: firebase.firestore.FieldValue.serverTimestamp()
            }).then((docRef) => {
                console.log("Task created with id: ", docRef.id);
            });
    }
}