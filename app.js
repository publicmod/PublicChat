// Firebase Configuración
const firebaseConfig = {
    apiKey: "AIzaSyBBxo1Fp94avCoVynQziedf8eyZlqbNwAE",
    authDomain: "publicchat-49785.firebaseapp.com",
    databaseURL: "https://publicchat-49785-default-rtdb.firebaseio.com",
    projectId: "publicchat-49785",
    storageBucket: "publicchat-49785.appspot.com",
    messagingSenderId: "270957708428",
    appId: "1:270957708428:web:dd164289c3f2d0128aa7a9"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

let username = `public-${Math.floor(Math.random() * 10000)}`;
let chatRoom = null;
let chatRef = null;
let usersRef = firebase.database().ref('users');

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('next-btn').addEventListener('click', findNewChat);

// Añadir usuario a la lista de conectados
function addUser() {
    const userRef = usersRef.child(username);
    userRef.set(true);
    userRef.onDisconnect().remove(); // Eliminar el usuario al desconectar
}

// Buscar nuevo chat
function findNewChat() {
    if (chatRef) {
        chatRef.off(); // Desconectar del chat actual
    }

    // Buscar un usuario conectado
    usersRef.once('value', (snapshot) => {
        const users = snapshot.val();
        const userKeys = Object.keys(users);

        // Si hay más de un usuario, emparejar con uno aleatorio
        if (userKeys.length > 1) {
            const randomUser = userKeys[Math.floor(Math.random() * userKeys.length)];
            if (randomUser !== username) {
                chatRoom = `chat_${username}_${randomUser}`;
                chatRef = firebase.database().ref(`chats/${chatRoom}`);
                chatRef.on('child_added', displayMessage);

                // Mensaje de usuario encontrado
                displayMessage({ username: "Sistema", message: `Chat encontrado con ${randomUser}. ¡Comienza a chatear!` });
            }
        } else {
            displayMessage({ username: "Sistema", message: "Esperando a otro usuario..." });
        }
    });
}

// Enviar mensaje
function sendMessage() {
    const message = document.getElementById('chat-input').value;
    if (message.trim() !== "" && chatRef) {
        const msgObj = {
            username: username,
            message: message,
            timestamp: Date.now()
        };
        chatRef.push(msgObj);
        document.getElementById('chat-input').value = ''; // Limpiar el campo de entrada
    }
}

// Mostrar mensajes en el chat
function displayMessage(data) {
    const messageEl = document.createElement('p');
    messageEl.textContent = `${data.username}: ${data.message}`;
    document.getElementById('chat-box').appendChild(messageEl);
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}

// Iniciar el primer chat
addUser();
findNewChat();
