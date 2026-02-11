const apiBase = "https://api.disneyapi.dev";

const listEl = document.getElementById("characters-list");
const detailEl = document.getElementById("character-detail");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Cargar inicial
fetchCharacters();

// Evento búsqueda
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchCharacters(query);
    } else {
        fetchCharacters();
    }
});

// ===== LISTADO =====
function fetchCharacters(query = "") {

    const url = query
        ? `${apiBase}/character?name=${query}`
        : `${apiBase}/character`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            showList(data.data);
        })
        .catch(err => console.error("ERROR FETCH:", err));
}

// ===== MOSTRAR LISTA =====
function showList(characters) {

    listEl.innerHTML = "";
    detailEl.classList.add("hidden");

    characters.forEach(ch => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${ch.imageUrl}" alt="${ch.name}">
            <h3>${ch.name}</h3>
        `;

        card.onclick = () => showDetail(ch._id);

        listEl.appendChild(card);
    });
}

// ===== DETALLE =====
function showDetail(id) {

    fetch(`${apiBase}/character/${id}`)
        .then(res => res.json())
        .then(result => {

            const ch = result.data; 

            detailEl.innerHTML = `
                <button class="btn-volver" onclick="closeDetail()">Volver</button>
                <h2>${ch.name}</h2>
                <img src="${ch.imageUrl}">
                <p><strong>Films:</strong> ${ch.films.length ? ch.films.join(", ") : "N/A"}</p>
                <p><strong>TV Shows:</strong> ${ch.tvShows.length ? ch.tvShows.join(", ") : "N/A"}</p>
                <p><strong>Video Games:</strong> ${ch.videoGames.length ? ch.videoGames.join(", ") : "N/A"}</p>
            `;

            detailEl.classList.remove("hidden");
            listEl.innerHTML = "";
            listEl.classList.add("hidden");

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

        })
        .catch(err => console.error("ERROR DETALLE:", err));
}

function closeDetail() {

    // Ocultar detalle
    detailEl.classList.add("hidden");

    // Limpiar el contenido del detalle
    detailEl.innerHTML = "";

    // Mostrar la lista (por si estaba oculta con CSS)
    listEl.classList.remove("hidden");

    // Scroll arriba FORZADO
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Recargar personajes
    fetchCharacters(searchInput.value.trim());
}


