import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA-ALyFNiNeUNnKK2MpzSTCfKrnkMjnU_Q",
  authDomain: "conoce-medellin-con-fercho.firebaseapp.com",
  projectId: "conoce-medellin-con-fercho",
  storageBucket: "conoce-medellin-con-fercho.firebasestorage.app",
  messagingSenderId: "525813230088",
  appId: "1:525813230088:web:aeb79969ea03358305ffbd"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Guardar reseña en Firestore
document.getElementById('review-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('nombre').value.trim();
  const rating = parseInt(document.getElementById('estrellas').value);
  const comment = document.getElementById('comentario').value.trim();

  // Todos los campos son obligatorios
  if (!name || !rating || !comment) return;

  await addDoc(collection(db, "reseñas"), {
    name,
    rating,
    comment,
    date: new Date()
  });

  // Limpiar formulario y cerrar modal
  document.getElementById('review-form').reset();
  document.getElementById('modal3').style.display = 'none';

  // Mostrar mensaje de éxito con SweetAlert2
  Swal.fire({
    icon: 'success',
    title: '¡Gracias por tu calificación!',
    showConfirmButton: false,
    timer: 2000,
  });
});


// Mostrar reseñas guardadas
async function cargarReseñas() {
  const contenedor = document.getElementById('reviews-list');
  contenedor.innerHTML = "<p>Cargando reseñas...</p>";

  const querySnapshot = await getDocs(collection(db, "reseñas"));
  contenedor.innerHTML = "";

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const estrellas = "⭐".repeat(data.rating) + "☆".repeat(5 - data.rating);
    contenedor.innerHTML += `
      <div class="review-item">
        <h3>${data.name}</h3>
        <div>${estrellas}</div>
        <p>${data.comment}</p>
      </div>
    `;
  });

  if (contenedor.innerHTML === "") {
    contenedor.innerHTML = "<p>No hay opiniones aún.</p>";
  }
}

// Abre el modal y carga reseñas
window.openViewReviewsModal = function () {
  document.getElementById('view-reviews-modal').style.display = 'flex';
  cargarReseñas();
};

window.closeViewReviewsModal = function () {
  document.getElementById('view-reviews-modal').style.display = 'none';
};
  
