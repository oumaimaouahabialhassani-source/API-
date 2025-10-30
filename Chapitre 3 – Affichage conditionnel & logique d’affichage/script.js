let produits = [
{nom: "pc portable",prix:900},
{nom: "souris",prix:25},
{nom: "clavier",prix:40},
{nom: "ecran",prix:150}
];

let liste = document.getElementById("produits");

let produitsFiltres = produits.filter(p =>p.prix < 100)


if (produitsFiltres.length === 0) {
liste.innerHTML ="<li>aucun produit en promotion.</li>";
} else{
     produitsFiltres.forEach(p => {
        let li = document.createElement("li");
        li.textContent = `${p.nom} - ${p.prix} €` ;
        liste.appendChild(li);
    })}