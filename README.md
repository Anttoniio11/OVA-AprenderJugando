# 🎓 AprenderJugando — OVA Interactivo v2

**Objeto Virtual de Aprendizaje** para Grado 3° y 4° de primaria (8-9 años).  
Con **Chispa ⚡** como mascota animada SVG que acompaña cada actividad.

---

## 📚 Módulos (31 en total)

| Materia | Módulos |
|---------|---------|
| 📖 **Español** (8) | Sílabas, Puntuación, B y V, S y C, Letra H, Acentuación, Tipos de Texto, Lectura Comprensiva |
| 🔢 **Matemáticas** (8) | Tablas, Fracciones, Geometría, Valor Posicional, Suma y Resta, Problemas, Medidas, Reloj |
| 🌿 **Ciencias Naturales** (8) | Seres Vivos, Ciclo del Agua, Vertebrados, Plantas, Cuerpo Humano, Ecosistemas, Estados de la Materia, Sistema Solar |
| 🌍 **Ciencias Sociales** (8) | Familia, Municipio, Regiones de Colombia, Derechos, Identidad Cultural, Historia, Convivencia, Medio Ambiente |

---

## ✨ Características

- 🤖 **Chispa** — mascota SVG animada con 6 expresiones (normal, feliz, sorprendido, triste, pensando, celebrando)
- 🔵 **Dots de navegación** — ve a cualquier pregunta directamente
- 📋 **Revisión completa** — al terminar ves todas tus respuestas con explicación
- 🔄 **Reintentar pregunta** — puedes volver a intentar cualquier pregunta incorrecta
- ⭐ **Sistema de estrellas** — 1, 2 o 3 estrellas por módulo guardadas localmente
- 📊 **Estadísticas** — contador de progreso por materia en el inicio
- 📱 **Responsive** — funciona en celular, tablet y computador

---

## 🚀 Subir a GitHub Pages (paso a paso)

### 1. Crear repositorio
1. Ve a [github.com](https://github.com) → inicia sesión
2. Clic en **"New repository"**
3. Nombre: `aprenderjugando` → marcar **Public** → **Create**

### 2. Subir archivos
**Opción fácil (arrastrando desde el navegador):**
1. En el repositorio clic en **"uploading an existing file"**
2. Arrastra **todos los archivos** de la carpeta `AprenderJugando2`
3. Mensaje: `OVA AprenderJugando v2` → **Commit changes**

**Con Git:**
```bash
cd AprenderJugando2
git init && git add .
git commit -m "OVA AprenderJugando v2"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/aprenderjugando.git
git push -u origin main
```

### 3. Activar GitHub Pages
1. Repositorio → **Settings** → **Pages**
2. Source: `Deploy from a branch`
3. Branch: `main` / folder: `/ (root)` → **Save**

### 4. ¡Listo! 🎉
URL disponible en ~2 minutos:
```
https://TU_USUARIO.github.io/aprenderjugando/
```

---

## 📁 Estructura
```
AprenderJugando2/
├── index.html              ← Página principal con tabs
├── css/styles.css          ← Estilos globales + Chispa
├── js/global.js            ← QuizEngine + Chispa SVG + progreso
└── pages/
    ├── espanol/            ← 8 módulos
    ├── matematicas/        ← 8 módulos
    ├── naturales/          ← 8 módulos
    └── sociales/           ← 8 módulos
```

---
Desarrollado para Educación Primaria — Colombia 🇨🇴
