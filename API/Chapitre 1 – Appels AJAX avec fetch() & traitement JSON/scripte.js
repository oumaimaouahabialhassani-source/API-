
fetch('https://api.open-meteo.com/v1/forecast?latitude=33.57&longitude=-7.59&current_weather=true')
  .then(response => response.json())
  .then(data => {
    console.log("Données reçues :", data);
  })
  .catch(error => {
    console.error("Erreur lors de la récupération :", error);
  });
