const btnPanier = document.getElementById('voir-panier');
const modalPanier = document.getElementById('modal-panier');
const btnFermer = document.querySelector('.fermer-panier');
const contenuPanier = document.getElementById('contenu-panier');
const totalPanier = document.getElementById('total-panier');
const compteurPanier = document.getElementById('compteur-panier');
const btnsAjouter = document.querySelectorAll('.ajouter-panier');

let panier = JSON.parse(localStorage.getItem('panierGarage')) || [];

function calculerTotal() {
    return panier.reduce((total, item) => total + (item.prix * item.quantite), 0);
}

function mettreAJourCompteur() {
    const totalArticles = panier.reduce((sum, item) => sum + item.quantite, 0);
    compteurPanier.textContent = totalArticles;
}

function ajouterAuPanier(nom, prix, type) {
    const itemIndex = panier.findIndex(item => item.nom === nom && item.type === type);

    if (itemIndex > -1 && type !== 'voiture') {
        panier[itemIndex].quantite += 1;
    } else {
        panier.push({ nom, prix, type, quantite: 1 });
    }

    localStorage.setItem('panierGarage', JSON.stringify(panier));
    mettreAJourCompteur();
    alert(`"${nom}" a été ajouté à votre commande.`);
}

function supprimerDuPanier(index) {
    panier.splice(index, 1);
    localStorage.setItem('panierGarage', JSON.stringify(panier));
    afficherPanier();
    mettreAJourCompteur();
}

function afficherPanier() {
    contenuPanier.innerHTML = '';
   
    if (panier.length === 0) {
        contenuPanier.innerHTML = '<p style="text-align: center; color: #555;">Votre panier est vide. Ajoutez des produits ou services !</p>';
        totalPanier.textContent = '0.00 €';
        return;
    }

    const liste = document.createElement('ul');
    liste.style.listStyleType = 'none';

    panier.forEach((item, index) => {
        const li = document.createElement('li');
        const sousTotal = (item.prix * item.quantite).toFixed(2);
       
        li.style.padding = '8px 0';
        li.style.borderBottom = '1px dotted #DDDDDD';

        li.innerHTML = `
            <strong>${item.nom}</strong>
            (<span style="color: #00E676;">${item.quantite}</span>)
            - ${item.prix.toFixed(2)} €/u
            = <span style="font-weight: 700; color: #FF5722;">${sousTotal} €</span>
            <button class="supprimer-item" data-index="${index}" style="margin-left: 15px; background: none; border: none; cursor: pointer; color: #FF5722; font-weight: bold; transition: color 0.2s;">
                [X]
            </button>
        `;
        liste.appendChild(li);
    });

    contenuPanier.appendChild(liste);
    totalPanier.textContent = `${calculerTotal().toFixed(2)} €`;

    document.querySelectorAll('.supprimer-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            supprimerDuPanier(index);
        });
    });
}

mettreAJourCompteur();

btnPanier.addEventListener('click', () => {
    afficherPanier();
    modalPanier.style.display = 'block';
});

btnFermer.addEventListener('click', () => {
    modalPanier.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modalPanier) {
        modalPanier.style.display = 'none';
    }
});

btnsAjouter.forEach(button => {
    button.addEventListener('click', (event) => {
        const produitElement = event.target.closest('.produit') || event.target;
       
        if (!produitElement.dataset.nom || !produitElement.dataset.prix) {
            alert("Erreur: Données de produit manquantes. Vérifiez les attributs data-nom et data-prix dans votre HTML.");
            return;
        }

        const nom = produitElement.dataset.nom;
        const prix = parseFloat(produitElement.dataset.prix);
        const type = produitElement.dataset.type || 'piece';
       
        ajouterAuPanier(nom, prix, type);
    });
});

document.getElementById('form-rdv').addEventListener('submit', (event) => {
    event.preventDefault();
   
    const serviceSelect = document.getElementById('service');
    const serviceNomComplet = serviceSelect.options[serviceSelect.selectedIndex].text;
   
    const prixMatch = serviceNomComplet.match(/\(Est\. ([\d\s,]+) €\)/);
    const prixEstime = prixMatch ? parseFloat(prixMatch[1].replace(/\s/g, '').replace(',', '.')) : 0;
   
    const nomService = serviceNomComplet.split(' (Est.')[0];

    ajouterAuPanier(`RDV: ${nomService}`, prixEstime, 'rendez-vous');

    alert(`Rendez-vous pour "${nomService}" ajouté au panier (Estimation: ${prixEstime.toFixed(2)} €).`);
});

document.getElementById('finaliser-commande').addEventListener('click', () => {
    const nom = document.getElementById('nom-client').value;
    const tel = document.getElementById('tel-client').value;
    const total = calculerTotal().toFixed(2);

    if (panier.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    
    if (!nom || !tel) {
        alert("Veuillez remplir votre Nom et votre Numéro de Téléphone pour la facturation.");
        return;
    }

    let factureDetails = `
        ==============================================
        DEMANDE DE COMMANDE / DEVIS - Garage
        ==============================================
        Client: ${nom}
        Tél: ${tel}
       
        Détails de la commande (${panier.length} article(s) unique(s)):
    `;
   
    panier.forEach(item => {
        factureDetails += `\n- ${item.nom} (${item.type}) : ${item.prix.toFixed(2)} € (x${item.quantite})`;
    });
   
    factureDetails += `
        ----------------------------------------------
        TOTAL ESTIME: ${total} €
        ==============================================
    `;

    console.log(factureDetails);
   
    alert("Confirmation envoyée ! Un devis détaillé vous sera transmis. (Facture affichée dans la console F12)");
   
    alert("Confirmation envoyée ! Un devis détaillé vous sera transmis. (Facture affichée dans la console F12)");
   
    panier = [];
    localStorage.removeItem('panierGarage');
    mettreAJourCompteur();
    modalPanier.style.display = 'none';
    
       // main.js

// Récupérer les éléments
const paymentForm = document.getElementById('payment-form');
const bankRadio = document.getElementById('bank-card');
const mpesaRadio = document.getElementById('mobile-money');
const bankFields = document.getElementById('bank-fields');
const mpesaFields = document.getElementById('mpesa-fields');
const submitButton = document.getElementById('submit-payment');
const confirmationMessage = document.getElementById('confirmation-message');

// --- Logique d'affichage dynamique des champs ---
paymentForm.addEventListener('change', (e) => {
    // Si la cible est un bouton radio pour le paiement
    if (e.target.name === 'payment-method') {
        const selectedMethod = e.target.value;
       
        // Cacher tous les champs d'abord
        bankFields.style.display = 'none';
        mpesaFields.style.display = 'none';
        submitButton.disabled = false; // Le bouton est activé dès qu'un choix est fait

        // Afficher les champs spécifiques
        if (selectedMethod === 'bank') {
            bankFields.style.display = 'block';
        } else if (selectedMethod === 'mpesa') {
            mpesaFields.style.display = 'block';
        }
    }
});


});

