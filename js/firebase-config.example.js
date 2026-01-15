/*
  Пример файла конфигурации Firebase для лайков и хранения счётчиков.
  1) Создайте проект на console.firebase.google.com
 2) В разделе Realtime Database включите базу данных (правила на время разработки: read/write true, но обновите позже)
 3) Скопируйте конфиг сюда и переименуйте файл в firebase-config.js

  Пример структуры ожидаемой переменной: window.firebaseConfig
*/
// window.firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "PROJECT.firebaseapp.com",
//   databaseURL: "https://PROJECT.firebaseio.com",
//   projectId: "PROJECT",
//   storageBucket: "PROJECT.appspot.com",
//   messagingSenderId: "...",
//   appId: "..."
// };

// После добавления конфига подключите Firebase SDK (через CDN) в index.html перед app.js:
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
// и затем инициализируйте:
// if(window.firebaseConfig){
//   firebase.initializeApp(window.firebaseConfig);
// }
