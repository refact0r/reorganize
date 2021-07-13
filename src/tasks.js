import firebase from 'firebase/app';
import { db } from './firebase';

// create a task
export function createTask(userId, listId, name) {
    if (name) {
        db.collection("tasks")
            .add({
                uid: userId,
                list_id: listId,
                name: name,
                completed: false,
                created: firebase.firestore.FieldValue.serverTimestamp()
            }).then((docRef) => {
                console.log("Task created with id: ", docRef.id);
            });
    }
}

// delete a task
export function deleteTask(id) {
    db.collection("tasks")
        .doc(id)
        .delete()
        .then(() => {
            console.log("Task deleted with id: ", id);
        });
}

// complete a task
export function completeTask(id, completed) {
    db.collection("tasks")
        .doc(id)
        .update({
            completed: !completed
        }).then(() => {
            console.log("Task completed with id: ", id);
        });
}