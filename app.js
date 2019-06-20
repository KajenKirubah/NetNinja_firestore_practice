const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

function renderCafe(doc) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    const city = document.createElement('span');
    const cross = document.createElement('div');

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    cross.addEventListener('click', e => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');

        db.collection('cafes').doc(id).delete();
    })
}

//get data
// db.collection('cafes').get().then(snapshot => {
//     console.log(snapshot.docs);

//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     })
// })

//save data
form.addEventListener('submit', e => {
    e.preventDefault();

    // console.log(form.name.value);
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    })

    form.name.value = '';
    form.city.value = '';
    
})

//real time

db.collection('cafes').where('city', '==', 'Toronto').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    console.log(changes);

    changes.forEach(change => {
        if(change.type === 'added') {
            renderCafe(change.doc)

        } else if (change.type === 'removed') {
            let id = '[data-id=' + change.doc.id + ']';
            const li = cafeList.querySelector(id);
            console.log(li);
            cafeList.removeChild(li);
        }
    })
})