const tasksList = document.querySelector('#tasks-list');
const form = document.querySelector('#add-task');

function showTasks(doc){
    let li = document.createElement('li');
    let task = document.createElement('span');
    let importance = document.createElement('span');
    let removeTask = document.createElement('button');

    li.setAttribute('data-id', doc.id);
    task.textContent = doc.data().task;
    importance.textContent = doc.data().importance;
    removeTask.textContent = 'DONE';

    li.appendChild(task);
    li.appendChild(importance);
    li.appendChild(removeTask);

    tasksList.appendChild(li);

    //removing data from db
    removeTask.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('tasks').doc(id).delete();
    })
}
/* recieving data from db
db.collection('tasks').orderBy('importance').get().then((snapshot) => {
    //console.log(snapshot.docs);
    snapshot.docs.forEach(doc => {
        //console.log(doc.data());
        showTasks(doc);
    })
});*/

//pushing data to db
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('tasks').add({
        task: form.task.value,
        importance: form.importance.value
    });
    form.task.value = '';
    form.importance.value = '';
})

/*real-time listner setup*/
db.collection('tasks').orderBy('importance').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    //console.log(changes);
    changes.forEach(change => {
        //console.log(change.doc.data())
        if(change.type == 'added'){
            showTasks(change.doc);
        } else if(change.type == 'removed'){
            let li = tasksList.querySelector('[data-id=' + change.doc.id + ']');
            tasksList.removeChild(li);
        }
    });
})

