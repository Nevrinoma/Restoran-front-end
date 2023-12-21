document.addEventListener('DOMContentLoaded', () => {
    fetchMenuItems();
    document.getElementById('addDishForm').addEventListener('submit', addDish);
    document.getElementById('updateDishForm').addEventListener('submit', updateDish);

});

function fetchMenuItems() {
    fetch('http://localhost:8090/api/menu')
        .then(response => response.json())
        .then(data => {
            displayMenuItems(data);
        })
        .catch(error => console.error('Ошибка при загрузке меню:', error));
}

function displayMenuItems(data) {
    const menuItems = data.dish;
    const menuContainer = document.getElementById('menuItems');
    menuContainer.innerHTML = ''; 

    menuItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>Tüüp: ${item["@attributes"].type}</p> 
            <p>Цена: ${item.price}€</p>
            <p>Аллергены: ${item.allergyTags}</p>
        `;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Kustuta';
        deleteButton.onclick = () => deleteDish(item["@attributes"].id); 
        itemDiv.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Uuenda';
        editButton.onclick = () => showUpdateForm(item);
        itemDiv.appendChild(editButton);
        menuContainer.appendChild(itemDiv);
    });
}



function deleteDish(dishId) {
    fetch(`http://localhost:8090/api/menu/${dishId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при удалении блюда');
        }
        return response.json();
    })
    .then(() => {
        fetchMenuItems(); 
    })
    .catch(error => console.error('Ошибка при удалении блюда:', error));
}


function addDish(event) {
    event.preventDefault();
    const name = document.getElementById('dishName').value;
    const price = document.getElementById('dishPrice').value;
    const allergens = document.getElementById('dishAllergens').value;
    const type = document.getElementById('dishType').value;
    const dish = { name, price, allergens, type };

    fetch('http://localhost:8090/api/menu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dish)
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById('addDishForm').reset();
        fetchMenuItems();
    })
    .catch(error => console.error('Ошибка при добавлении блюда:', error));
}

function updateDish(event) {
    event.preventDefault();
    const id = document.getElementById('updateDishId').value;
    const name = document.getElementById('updateDishName').value;
    const price = document.getElementById('updateDishPrice').value;
    const allergens = document.getElementById('updateDishAllergens').value;
    const type = document.getElementById('updateDishType').value;

    const updatedDish = {
        "@attributes": {
            "id": id,
            "type": type
        },
        "name": name,
        "price": price,
        "allergyTags": allergens
    };

    fetch(`http://localhost:8090/api/menu/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDish)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Блюдо не найдено');
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('updateDishModal').style.display = 'none';
        fetchMenuItems();
    })
    .catch(error => console.error('Ошибка при обновлении блюда:', error));
}

function showUpdateForm(item) {
    const updateModal = document.getElementById('updateDishModal');
    updateModal.style.display = 'block';

    document.getElementById('updateDishId').value = item["@attributes"].id;
    document.getElementById('updateDishName').value = item.name;
    document.getElementById('updateDishPrice').value = item.price;
    document.getElementById('updateDishAllergens').value = item.allergyTags || '';
    document.getElementById('updateDishType').value = item["@attributes"].type; 
}

