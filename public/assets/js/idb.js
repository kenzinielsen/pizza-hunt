
//create variable to hohld db connection
let db;
//establish a connectoin to indexeddb database calle pizzza hunt andset tit to the version 1 
const request = indexedDB.open('pizza_hunt', 1);

//this ecent will emit if the database version changes 
request.onupgradeneeded = function(event) {
    //save reference to othe database 
    const db = event.target.result;
    //create an object store (table called new pizza set ti to have an auto incrementing primary key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
};
//upon a successful
request.onsuccess = function(event) {
    //when db is successfully created witht its object store 
    db = event.target.result;

    ///check if app is online if ues run uploadpizza functio to 
    if (navigator.online) {
        //uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode)
};

//used if we attempt to submit a new pizza and theres no internet connection
function saveRecord(record) {
    //open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the object store for 'new pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //add record to your store with add method
    pizzaObjectStore.add(record);
}

function uploadPizza() {
    //open a transaction on yor db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //get all records from stre ans set to a var
    const getAll = pizzaObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse)
                }
                //open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite')
                //access the new pizza object
                const pizzaObjectStore = transaction.objectStore('new_pizza')
                //clear all items in store
                pizzaObjectStore.clear();

                alert('All saved pizzas have been submitted');
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

}

//listen for app coming back online
window.addEventListener('online', uploadPizza);