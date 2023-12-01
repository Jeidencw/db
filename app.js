import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js"
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js'

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

const sanitize = string => DOMPurify.sanitize(string)

const getFormattedDate = createdAt => new Intl
    .DateTimeFormat('pt-BR', { dataStyle: 'short', timeStyle: 'short' })
    .format(createdAt.toDate())

onSnapshot(collectionGame, querySnapshot => {
    if(!querySnapshot.metadata.hasPendingWrites){
        gamesList.innerHTML = ''

        const games = querySnapshot.docs.map(doc => {
            const [id, { title, developedBy, createdAt }] = [doc.id, doc.data()]

            const liGame = document.createElement('li')
            liGame.setAttribute('data-id', id)
            liGame.setAttribute('class', 'my-4')

            const h5 = document.createElement('h5')
            h5.textContent = sanitize(title)

            const ul = document.createElement('ul')

            const liDevelopedBy = document.createElement('li')
            liDevelopedBy.textContent = `Desenvolvido por ${sanitize(developedBy)}`

            ul.append(liDevelopedBy)

            if(createdAt){
                const liDate = document.createElement('li')
                liDate.textContent = `Adicionado no banco em: ${getFormattedDate(createdAt)}`
                ul.append(liDate)
            }

            const button = document.createElement('button')
            button.textContent = 'Remover'
            button.setAttribute('data-remove', id)
            button.setAttribute('class', 'btn btn-danger btm-sm')


            liGame.append(h5, ul, button)

            return liGame
        })

        games.forEach(game => gamesList.append(game))
    }
})

formAddGame.addEventListener('submit', e => {
    e.preventDefault()

    addDoc(collectionGame, {
        title: sanitize(e.target.title.value),
        developedBy: sanitize(e.target.developer.value),
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
                console.log('Deletado')
            })
            .catch(console.log)
    }
})