document.addEventListener("DOMContentLoaded", () => {
  console.log("Script carregado ✅");

  // ====== LIKE (♡) ======
  document.querySelectorAll(".btn-like").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("liked");
      btn.style.color = btn.classList.contains("liked") ? "red" : "black";
      console.log("Produto curtido:", btn.closest(".produto-item").querySelector(".produto-nome").innerText);
    });
  });

  // ====== ADD (➕) ======
  document.querySelectorAll(".btn-add").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.add("added");
      setTimeout(() => btn.classList.remove("added"), 500);
      console.log("Produto adicionado:", btn.closest(".produto-item").querySelector(".produto-nome").innerText);
    });
  });

  // ====== CPF ↔ CNPJ TOGGLE ======
  const toggle = document.getElementById("toggle");
  const body = document.body;
  const docField = document.getElementById("docField");

  if (toggle && docField) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      body.classList.toggle("cnpj-mode");

      if (toggle.classList.contains("active")) {
        console.log("CNPJ selecionado");
        docField.placeholder = "CNPJ";
        docField.name = "cnpj";
      } else {
        console.log("CPF selecionado");
        docField.placeholder = "CPF";
        docField.name = "cpf";
      }
    });
  }

  // ====== CARROSSEL (Bootstrap já controla autoplay) ======
  const carousel = document.querySelector("#carouselOfertas");
  if (carousel) {
    const bsCarousel = new bootstrap.Carousel(carousel, { interval: 4000, ride: "carousel" });
    console.log("Carrossel inicializado");
  }
});
