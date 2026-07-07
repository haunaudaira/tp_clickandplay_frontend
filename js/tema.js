// busca el boton que cambia el tema
const toggle = document.getElementById('theme-toggle');

// busca si el usuario ya habia elegido un tema antes
const savedTheme = localStorage.getItem('theme');

// si el tema guardado es oscuro, se activa la clase dark
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

// si existe el boton, al hacer click cambia el tema
if (toggle) {
  toggle.addEventListener('click', () => {
    // alterna entre agregar o quitar la clase dark
    document.body.classList.toggle('dark');

    // decide que tema quedo activo
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';

    // guarda la eleccion para que se recuerde al recargar
    localStorage.setItem('theme', theme);
  });
}