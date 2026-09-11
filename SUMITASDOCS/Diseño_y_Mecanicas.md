# Diseño y Mecánicas del Juego

## Flujo Principal
1. **Inicio:** Pantalla principal con un botón "Jugar" y un botón "Panel de Tutor".
2. **Juego de Sumas:** 
   - Se muestra una suma en pantalla con números muy grandes.
   - 4 botones coloridos en la parte inferior con posibles respuestas.
   - Si acierta: Aparece una animación rápida de celebración, gana un "maní" (o ítem) y pasa a la siguiente suma.
   - Si falla: El botón incorrecto vibra sutilmente o se pone gris, animando a intentar con los restantes sin castigar visualmente.
3. **Mascota Virtual (Dumbo):** 
   - Un espacio dedicado para interactuar. Dumbo espera.
   - Botón "Alimentar": Al tocarlo, si hay maníes disponibles, se lanza la animación de Dumbo comiendo y poniéndose feliz.

## Sistema de Dificultad (Local Storage)
- **Nivel 1:** Sumas de 1 dígito (ej: 2+3, 4+1, 5+4).
- **Progresión:** Cuando acumule 50 sumas correctas, se puede desbloquear el Nivel 2 en el panel de tutor.
- **Nivel 2:** Sumas que involucran un número de 2 dígitos y uno de 1 dígito (ej: 12+3).

## Experiencia de Usuario (UX) & UI
- **Tipografía:** Muy legible, tipo "Comic Sans" o "Baloo" para un tono juguetón.
- **Colores:** Paleta de Disney (Amarillos, Azules pasteles, Rojos vibrantes).
- **Animaciones:** Crucial para mantener la atención. Uso de `transform: scale()` para rebotes, `opacity` para transiciones fluidas. Uso de animaciones de partículas (confeti) al ganar.

## Base de Datos / Estado Local
- Almacenaremos un objeto en `localStorage`:
```json
{
  "stats": {
    "correctas": 0,
    "incorrectas": 0,
    "manies": 0,
    "nivel_actual": 1
  }
}
```
Esto permitirá que el Panel de Tutor lea los datos instantáneamente en el modo local.
