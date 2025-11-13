// Wrapper para plataformas que esperan `index.js` en la raíz.
// Este archivo carga la aplicación ESM que está en `Front-end/app.js`.

(async () => {
  try {
    await import('./Front-end/app.js');
  } catch (err) {
    console.error('Error arrancando Front-end/app.js:', err);
    process.exit(1);
  }
})();
