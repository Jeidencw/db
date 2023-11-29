import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js"
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyCpBp8sIrWssPIFchXntgf91r7luGwIvjc",
    authDomain: "jeidencw-cjrm.firebaseapp.com",
    projectId: "jeidencw-cjrm",
    storageBucket: "jeidencw-cjrm.appspot.com",
    messagingSenderId: "1085563930204",
    appId: "1:1085563930204:web:8d2eddb06308b180f70899",
    measurementId: "G-MG4Z8HZXLP"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const collectionGame = collection(db, 'games')

const gamesList = document.querySelector('[data-js="games-list"]')
const formAddGame = document.querySelector('[data-js="add-game-form"]')

getDocs(collectionGame)
    .then(querySnapshot => {
        //querySnapshot.forEach((doc) => console.log(doc.id, " => ", doc.data()))
        //querySnapshot.docs.forEach(doc => console.log(doc.id, " => ", doc.data()))

        const gamesLis = querySnapshot.docs.reduce((acc, doc) => {
            const { title, developedBy, createdAt } = doc.data()

            acc += `<li data-id="${doc.id}" class="my-4">
                        <h5>${title}</h5>

                        <ul>
                            <li>Desenvolvido por ${developedBy}</li>
                            <li>Adicionado no banco em ${createdAt.toDate()}</li>
                        </ul>

                        <button data-remove="${doc.id}" class="btn btn-danger btn-sm mt-2">Remover</button>
                   </li>`

            return acc
        }, '')

        gamesList.innerHTML = gamesLis
    })
    .catch(console.log())

formAddGame.addEventListener('submit', e => {
    e.preventDefault()

    addDoc(collectionGame, {
        title: e.target.title.value,
        developedBy: e.target.developer.value,
        createdAt: serverTimestamp()
    })
    .then(doc => console.log('Documento criado com o id: ', doc.id))
    .catch(console.log)
})

gamesList.addEventListener('click', e => {
    const idRemoveButton = e.target.dataset.remove

    if(idRemoveButton){      
        deleteDoc(doc(db, 'games', idRemoveButton))
            .then(() => {
                const game = document.querySelector(`[data-id="${idRemoveButton}"]`)
                game.remove()
            })
            .catch(console.log)
    }
})