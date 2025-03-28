"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Bike,
  Bus,
  Car,
  AlertTriangle,
  Leaf,
  CreditCard,
  Users,
  TrendingUp,
  Building2,
  Train,
  Trees,
  Zap,
  Footprints,
  Share2,
  Ban,
  Timer,
  Truck,
  Smartphone,
  School,
  Landmark,
  Wifi,
} from "lucide-react"

export default function EcoCityTransportGame() {
  // Game state
  const [turn, setTurn] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [winMessage, setWinMessage] = useState("")
  // Change the starting budget from 1000 to 2000
  const [budget, setBudget] = useState(2000)
  const [pollution, setPollution] = useState(60)
  const [ecology, setEcology] = useState(40)
  const [satisfaction, setSatisfaction] = useState(50)
  const [eventActive, setEventActive] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [eventHistory, setEventHistory] = useState([])
  const [gameLog, setGameLog] = useState([
    { turn: 0, message: "Bienvenue à EcoCity! Vous êtes le nouveau responsable des transports." },
  ])
  const [cityInfrastructure, setCityInfrastructure] = useState({
    bikeLanes: 1,
    publicTransport: 1,
    greenSpaces: 1,
    pedestrianZones: 0,
    electricVehicles: 0,
    carRoads: 3,
    smartCity: 0,
    trainNetwork: 0,
    cargoTransport: 1,
    bikeSharing: 0,
  })

  // Modify the actions array to track if they've been used
  const [usedActions, setUsedActions] = useState([])

  // Add state for budget warning popup
  const [showBudgetWarning, setShowBudgetWarning] = useState(false)

  // Define events
  const scheduledEvents = [
    {
      id: 100,
      title: "Semaine de la mobilité",
      description: "La ville organise une semaine dédiée aux transports durables.",
      effects: { pollution: -5, ecology: +5, satisfaction: +10 },
      choices: [
        { text: "Soutenir activement", effects: { pollution: -3, ecology: +2, satisfaction: +5 } },
        { text: "Participer modestement", effects: { pollution: -1, ecology: +1, satisfaction: +2 } },
      ],
    },
    {
      id: 101,
      title: "Pic de pollution",
      description: "Un épisode de pollution atmosphérique frappe la ville.",
      effects: { pollution: +15, satisfaction: -10 },
      choices: [
        { text: "Restreindre la circulation", effects: { pollution: -10, satisfaction: -5 } },
        { text: "Informer la population", effects: { pollution: -5, satisfaction: -2 } },
      ],
    },
    {
      id: 102,
      title: "Nouvelles subventions gouvernementales",
      description: "Le gouvernement offre des subventions pour les projets écologiques.",
      effects: { budget: +200 },
      choices: [
        { text: "Investir dans les transports publics", effects: { pollution: -5, ecology: +5, satisfaction: +5 } },
        { text: "Développer les pistes cyclables", effects: { pollution: -3, ecology: +3, satisfaction: +3 } },
      ],
    },
  ]

  const randomEvents = [
    {
      id: 200,
      title: "Grève des transports",
      description: "Une grève surprise paralyse le réseau de transport en commun.",
      effects: { satisfaction: -15 },
      choices: [
        { text: "Négocier avec les syndicats", effects: { satisfaction: +10, budget: -50 } },
        { text: "Réquisitionner des bus", effects: { satisfaction: -5, pollution: +5 } },
      ],
    },
    {
      id: 201,
      title: "Accident de la route",
      description: "Un grave accident de la route engendre des embouteillages monstres.",
      effects: { pollution: +10, satisfaction: -8 },
      choices: [
        { text: "Envoyer des équipes de secours", effects: { satisfaction: +5, budget: -30 } },
        { text: "Laisser la situation se résoudre", effects: { satisfaction: -5 } },
      ],
    },
    {
      id: 202,
      title: "Découverte d'une espèce protégée",
      description: "Une espèce rare est découverte dans un espace vert urbain.",
      effects: { ecology: +10 },
      choices: [
        { text: "Protéger la zone", effects: { budget: -40, ecology: +5 } },
        { text: "Ignorer la découverte", effects: { ecology: -5 } },
      ],
    },
    {
      id: 203,
      title: "Festival de l'environnement",
      description: "Un festival attire les foules et sensibilise à l'écologie.",
      effects: { satisfaction: +10, ecology: +5 },
      choices: [
        { text: "Soutenir financièrement", effects: { budget: -50, satisfaction: +5 } },
        { text: "Assurer la logistique", effects: { budget: -20, ecology: +3 } },
      ],
    },
  ]

  // Actions available to the player
  const actions = [
    // Infrastructure actions (good)
    {
      id: 1,
      title: "Pistes cyclables",
      description: "Investir dans de nouvelles pistes cyclables",
      icon: <Bike className="h-8 w-8 text-green-500" />,
      cost: 200,
      effects: { pollution: -10, ecology: +15, satisfaction: +5 },
      cityEffect: { bikeLanes: +1 },
      category: "infrastructure-good",
    },
    {
      id: 2,
      title: "Transports publics",
      description: "Améliorer le réseau de bus et tramways",
      icon: <Bus className="h-8 w-8 text-blue-500" />,
      cost: 350,
      effects: { pollution: -15, ecology: +10, satisfaction: +10 },
      cityEffect: { publicTransport: +1 },
      category: "infrastructure-good",
    },
    {
      id: 5,
      title: "Zones piétonnes",
      description: "Créer des zones sans voitures en centre-ville",
      icon: <Footprints className="h-8 w-8 text-amber-500" />,
      cost: 280,
      effects: { pollution: -12, ecology: +8, satisfaction: -5 },
      cityEffect: { pedestrianZones: +1, carRoads: -0.5 },
      category: "infrastructure-good",
    },
    {
      id: 6,
      title: "Bornes de recharge",
      description: "Installer des bornes pour véhicules électriques",
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      cost: 320,
      effects: { pollution: -7, ecology: +5, satisfaction: +3 },
      cityEffect: { electricVehicles: +1 },
      category: "infrastructure-good",
    },
    {
      id: 7,
      title: "Réseau ferroviaire",
      description: "Développer le réseau de trains et tramways",
      icon: <Train className="h-8 w-8 text-red-500" />,
      cost: 500,
      effects: { pollution: -10, ecology: +15, satisfaction: +12 },
      cityEffect: { trainNetwork: +1 },
      category: "infrastructure-good",
    },
    {
      id: 9,
      title: "Stations de vélos partagés",
      description: "Installer des stations de vélos en libre-service",
      icon: <Bike className="h-8 w-8 text-cyan-500" />,
      cost: 230,
      effects: { pollution: -8, ecology: +10, satisfaction: +6 },
      cityEffect: { bikeSharing: +1 },
      category: "infrastructure-good",
    },

    // Infrastructure actions (harmful)
    {
      id: 3,
      title: "Nouvelles routes",
      description: "Construire plus de routes pour les voitures",
      icon: <Car className="h-8 w-8 text-gray-500" />,
      cost: 300,
      effects: { pollution: +15, ecology: -10, satisfaction: +8, budget: +50},
      cityEffect: { carRoads: +1 },
      category: "infrastructure-bad",
    },
    {
      id: 8,
      title: "Transport de marchandises",
      description: "Optimiser la logistique urbaine avec des camions",
      icon: <Truck className="h-8 w-8 text-blue-700" />,
      cost: 280,
      effects: { pollution: +10, ecology: -5, satisfaction: +8},
      cityEffect: { cargoTransport: +1 },
      category: "infrastructure-bad",
    },
    {
      id: 21,
      title: "Suppression de pistes cyclables",
      description: "Supprimer des pistes cyclables pour élargir les routes",
      icon: <Ban className="h-8 w-8 text-red-600" />,
      cost: 150,
      effects: { pollution: +10, ecology: -10, satisfaction: -10},
      cityEffect: { bikeLanes: -1, carRoads: +0.5 },
      category: "infrastructure-bad",
    },
    {
      id: 22,
      title: "Parkings en centre-ville",
      description: "Construire des parkings pour faciliter l'accès en voiture",
      icon: <Car className="h-8 w-8 text-gray-600" />,
      cost: 250,
      effects: { pollution: +15, ecology: -10, satisfaction: +10, budget: +50 },
      cityEffect: { carRoads: +0.5 },
      category: "infrastructure-bad",
    },
    {
      id: 23,
      title: "Réduction des transports publics",
      description: "Réduire la fréquence des bus pour économiser",
      icon: <Bus className="h-8 w-8 text-red-400" />,
      cost: 100,
      effects: { pollution: +10, ecology: -8, satisfaction: -15, budget: +100 },
      cityEffect: { publicTransport: -0.5 },
      category: "infrastructure-bad",
    },

    // Program actions (good)
    {
      id: 11,
      title: "Covoiturage",
      description: "Lancer une plateforme de covoiturage municipale",
      icon: <Share2 className="h-8 w-8 text-purple-500" />,
      cost: 150,
      effects: { pollution: -8, ecology: +8, satisfaction: +2 },
      category: "program-good",
    },
    {
      id: 12,
      title: "Journée sans voiture",
      description: "Organiser une journée mensuelle sans voiture",
      icon: <Ban className="h-8 w-8 text-red-500" />,
      cost: 100,
      effects: { pollution: -5, ecology: +8, satisfaction: -7 },
      category: "program-good",
    },
    {
      id: 13,
      title: "Subventions vélos",
      description: "Offrir des subventions pour l'achat de vélos",
      icon: <Bike className="h-8 w-8 text-green-600" />,
      cost: 180,
      effects: { pollution: -7, ecology: +12, satisfaction: +7 },
      category: "program-good",
    },
    {
      id: 14,
      title: "Horaires décalés",
      description: "Encourager les horaires de travail flexibles",
      icon: <Timer className="h-8 w-8 text-blue-400" />,
      cost: 80,
      effects: { pollution: -6, ecology: +3, satisfaction: +10 },
      category: "program-good",
    },
    {
      id: 15,
      title: "Application mobilité",
      description: "Développer une app pour optimiser les déplacements",
      icon: <Smartphone className="h-8 w-8 text-indigo-600" />,
      cost: 220,
      effects: { pollution: -5, ecology: +2, satisfaction: +15 },
      category: "program-good",
    },
    {
      id: 16,
      title: "Pédibus scolaire",
      description: "Organiser des groupes de marche pour les écoliers",
      icon: <School className="h-8 w-8 text-amber-600" />,
      cost: 120,
      effects: { pollution: -4, ecology: +6, satisfaction: +8, budget: +100 },
      category: "program-good",
    },
    {
      id: 19,
      title: "Campagne de sensibilisation",
      description: "Sensibiliser aux bienfaits des mobilités douces",
      icon: <Landmark className="h-8 w-8 text-blue-600" />,
      cost: 150,
      effects: { pollution: -2, ecology: +7, satisfaction: +5 },
      category: "program-good",
    },

    // Program actions (harmful)
    {
      id: 17,
      title: "Réduction des taxes carburant",
      description: "Réduire les taxes sur le carburant pour les automobilistes",
      icon: <Car className="h-8 w-8 text-red-600" />,
      cost: 50,
      effects: { pollution: +12, ecology: -10, satisfaction: +15, budget: -100 },
      category: "program-bad",
    },
    {
      id: 18,
      title: "Augmentation tarifs transports",
      description: "Augmenter le prix des transports publics",
      icon: <Bus className="h-8 w-8 text-red-700" />,
      cost: 0,
      effects: { pollution: +15, ecology: -5, satisfaction: -20, budget: +100 },
      category: "program-bad",
    },
    {
      id: 25,
      title: "Réduction des limitations de vitesse",
      description: "Augmenter les limitations de vitesse en ville",
      icon: <TrendingUp className="h-8 w-8 text-red-500" />,
      cost: 80,
      effects: { pollution: +8, ecology: -6, satisfaction: +10 },
      category: "program-bad",
    },
  ]

  // Add a citizen quotes system
  const [citizenQuote, setCitizenQuote] = useState({
    text: "Bienvenue dans notre ville! Que ferez-vous pour améliorer nos transports?",
    type: "neutral",
  })

  // Add a function to generate citizen quotes based on actions and city state
  const generateCitizenQuote = (action = null, eventChoice = null) => {
    // Quotes based on actions
    const goodQuotes = [
      "Excellente initiative pour notre environnement!",
      "Enfin quelqu'un qui pense à l'avenir de notre ville!",
      "C'est exactement ce dont nous avions besoin!",
      "Bravo pour cette décision écologique!",
      "Ça va vraiment améliorer notre qualité de vie!",
    ]

    const badQuotes = [
      "Pas très écologique, tout ça...",
      "Vous pensez vraiment que c'est une bonne idée?",
      "On dirait que la pollution vous importe peu...",
      "Nos enfants méritent mieux que ça!",
      "C'est un pas en arrière pour notre ville!",
    ]

    const neutralQuotes = [
      "Intéressant, voyons où cela nous mène.",
      "Une décision qui divise l'opinion publique.",
      "Certains approuvent, d'autres sont sceptiques.",
      "L'avenir nous dira si c'était le bon choix.",
      "Une solution de compromis, apparemment.",
    ]

    // Quotes based on city state
    const pollutionHighQuotes = [
      "L'air devient irrespirable!",
      "Je ne peux même plus ouvrir mes fenêtres à cause de la pollution!",
      "Mes enfants toussent constamment à cause de cette pollution!",
    ]

    const ecologyHighQuotes = [
      "Notre ville devient un modèle écologique!",
      "Quelle joie de voir tant d'espaces verts!",
      "Je suis fier de vivre dans une ville aussi verte!",
    ]

    const satisfactionLowQuotes = [
      "Nous sommes vraiment mécontents de votre gestion!",
      "Les citoyens commencent à manifester leur mécontentement!",
      "Si ça continue comme ça, vous ne serez pas réélu!",
    ]

    const budgetLowQuotes = [
      "La ville est au bord de la faillite!",
      "Comment comptez-vous financer vos projets sans argent?",
      "L'économie de notre ville est en danger!",
    ]

    // If an action was just performed
    if (action) {
      if (action.category.includes("good")) {
        return { text: goodQuotes[Math.floor(Math.random() * goodQuotes.length)], type: "positive" }
      } else if (action.category.includes("bad")) {
        return { text: badQuotes[Math.floor(Math.random() * badQuotes.length)], type: "negative" }
      } else {
        return { text: neutralQuotes[Math.floor(Math.random() * neutralQuotes.length)], type: "neutral" }
      }
    }

    // If an event choice was made
    if (eventChoice) {
      if (eventChoice.effects.pollution < 0 || eventChoice.effects.ecology > 0) {
        return { text: goodQuotes[Math.floor(Math.random() * goodQuotes.length)], type: "positive" }
      } else if (eventChoice.effects.pollution > 0 || eventChoice.effects.ecology < 0) {
        return { text: badQuotes[Math.floor(Math.random() * badQuotes.length)], type: "negative" }
      } else {
        return { text: neutralQuotes[Math.floor(Math.random() * neutralQuotes.length)], type: "neutral" }
      }
    }

    // Based on city state
    if (pollution > 70) {
      return { text: pollutionHighQuotes[Math.floor(Math.random() * pollutionHighQuotes.length)], type: "negative" }
    } else if (ecology > 70) {
      return { text: ecologyHighQuotes[Math.floor(Math.random() * ecologyHighQuotes.length)], type: "positive" }
    } else if (satisfaction < 30) {
      return { text: satisfactionLowQuotes[Math.floor(Math.random() * satisfactionLowQuotes.length)], type: "negative" }
    } else if (budget < 500) {
      return { text: budgetLowQuotes[Math.floor(Math.random() * budgetLowQuotes.length)], type: "negative" }
    }

    // Default random quote
    const allQuotes = [...goodQuotes, ...neutralQuotes]
    return { text: allQuotes[Math.floor(Math.random() * allQuotes.length)], type: "neutral" }
  }

  // Function to handle player actions
  const handleAction = (action) => {
    if (budget < action.cost) {
      addToLog(`Budget insuffisant pour ${action.title}`)
      return
    }

    if (usedActions.includes(action.id)) {
      addToLog(`Action déjà utilisée: ${action.title}`)
      return
    }

    // Apply effects
    setBudget((prev) => prev - action.cost)
    setPollution((prev) => Math.max(0, Math.min(100, prev + action.effects.pollution)))
    setEcology((prev) => Math.max(0, Math.min(100, prev + action.effects.ecology)))
    setSatisfaction((prev) => Math.max(0, Math.min(100, prev + action.effects.satisfaction)))

    // Apply budget effects if any (for actions that generate revenue)
    if (action.effects.budget) {
      setBudget((prev) => prev + action.effects.budget)
    }

    // Apply city infrastructure effects if any
    if (action.cityEffect) {
      setCityInfrastructure((prev) => {
        const newState = { ...prev }
        Object.keys(action.cityEffect).forEach((key) => {
          newState[key] = Math.max(0, newState[key] + action.cityEffect[key])
        })
        return newState
      })
    }

    // Generate and set a citizen quote
    setCitizenQuote(generateCitizenQuote(action))

    // Mark action as used
    setUsedActions((prev) => [...prev, action.id])

    addToLog(`Action: ${action.title} - Coût: ${action.cost}€`)

    // End turn
    nextTurn()
  }

  // Function to handle event choices
  const handleEventChoice = (choice) => {
    // Apply choice effects
    if (choice.effects.pollution) {
      setPollution((prev) => Math.max(0, Math.min(100, prev + choice.effects.pollution)))
    }
    if (choice.effects.ecology) {
      setEcology((prev) => Math.max(0, Math.min(100, prev + choice.effects.ecology)))
    }
    if (choice.effects.satisfaction) {
      setSatisfaction((prev) => Math.max(0, Math.min(100, prev + choice.effects.satisfaction)))
    }
    if (choice.effects.budget) {
      setBudget((prev) => prev + choice.effects.budget)
    }

    // Generate and set a citizen quote
    setCitizenQuote(generateCitizenQuote(null, choice))

    addToLog(`Événement "${currentEvent.title}" - Choix: ${choice.text}`)
    setEventActive(false)

    // End turn
    nextTurn()
  }

  // Function to add message to game log
  const addToLog = (message) => {
    setGameLog((prev) => [...prev, { turn, message }])
  }

  // Function to advance to next turn
  const nextTurn = () => {
    // Monthly expenses and income
    const monthlyExpenses = 100
    const monthlyIncome = 100
    const netChange = monthlyIncome - monthlyExpenses
    setBudget((prev) => prev + netChange)

    // Add to log
    addToLog(`Bilan mensuel: ${netChange}€ (Revenus: +${monthlyIncome}€, Dépenses: -${monthlyExpenses}€)`)

    // Advance turn
    const newTurn = turn + 1
    setTurn(newTurn)

    // Check for scheduled event (every 5 turns)
    if (newTurn % 5 === 0 && !eventActive) {
      const eventIndex = Math.floor(newTurn / 5 - 1) % scheduledEvents.length
      triggerEvent(scheduledEvents[eventIndex])
    }
    // Check for random event (20% chance) if no scheduled event
    else if (!eventActive && Math.random() < 0.2) {
      triggerRandomEvent()
    }
    // Occasionally generate a new citizen quote (30% chance)
    else if (Math.random() < 0.3) {
      setCitizenQuote(generateCitizenQuote())
    }

    // Check win/lose conditions
    checkGameStatus()
  }

  // Function to trigger a specific event
  const triggerEvent = (event) => {
    setCurrentEvent(event)
    setEventActive(true)

    // Apply immediate effects
    if (event.effects.pollution) {
      setPollution((prev) => Math.max(0, Math.min(100, prev + event.effects.pollution)))
    }
    if (event.effects.ecology) {
      setEcology((prev) => Math.max(0, Math.min(100, prev + event.effects.ecology)))
    }
    if (event.effects.satisfaction) {
      setSatisfaction((prev) => Math.max(0, Math.min(100, prev + event.effects.satisfaction)))
    }
    if (event.effects.budget) {
      setBudget((prev) => prev + event.effects.budget)
    }

    // Add to event history
    setEventHistory((prev) => [...prev, event.id])

    addToLog(`Événement: ${event.title}`)
  }

  // Function to trigger a random event
  const triggerRandomEvent = () => {
    // Filter out events that have happened recently
    const availableEvents = randomEvents.filter((event) => !eventHistory.includes(event.id))

    if (availableEvents.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableEvents.length)
      triggerEvent(availableEvents[randomIndex])
    }
  }

  // Function to check game status
  const checkGameStatus = () => {
    // Game ends after 20 turns
    // Reduce the number of turns from 20 to 15 in the checkGameStatus function
    // In the checkGameStatus function, change:
    // to:
    if (turn >= 15) {
      endGame("Fin des 15 tours")
      return
    }

    // Lose conditions
    if (budget < 0 && !gameOver) {
      // Show budget warning popup but don't end game yet
      setShowBudgetWarning(true)
      return
    }

    if (satisfaction <= 10) {
      endGame("Les citoyens sont révoltés! Vous avez été démis de vos fonctions.")
      return
    }

    if (pollution >= 90) {
      endGame("Catastrophe écologique! La ville est devenue invivable.")
      return
    }
  }

  // Function to end the game
  const endGame = (reason) => {
    setGameOver(true)

    // Calculate score and determine outcome, including budget factor
    const budgetFactor = Math.min(100, budget / 20) // Budget contributes up to 100 points
    const score = ecology * 0.3 + satisfaction * 0.2 + (100 - pollution) * 0.3 + budgetFactor * 0.2

    let message
    if (score >= 80) {
      message = `Félicitations! Vous avez créé une ville modèle en matière de transports durables. Score: ${Math.round(score)}/100`
    } else if (score >= 60) {
      message = `Bien joué! Votre ville a fait des progrès significatifs vers la durabilité. Score: ${Math.round(score)}/100`
    } else if (score >= 40) {
      message = `Résultat mitigé. Votre ville a encore beaucoup de défis à relever. Score: ${Math.round(score)}/100`
    } else {
      message = `Échec. Votre gestion n'a pas permis d'améliorer la situation. Score: ${Math.round(score)}/100`
    }

    setWinMessage(message)
    addToLog(`Fin de partie: ${reason}`)
  }

  // Update the restartGame function to reset usedActions
  const restartGame = () => {
    setTurn(1)
    setGameOver(false)
    setWinMessage("")
    setBudget(2000)
    setPollution(60)
    setEcology(40)
    setSatisfaction(50)
    setEventActive(false)
    setCurrentEvent(null)
    setEventHistory([])
    setUsedActions([])
    setCityInfrastructure({
      bikeLanes: 1,
      publicTransport: 1,
      greenSpaces: 1,
      pedestrianZones: 0,
      electricVehicles: 0,
      carRoads: 3,
      smartCity: 0,
      trainNetwork: 0,
      cargoTransport: 1,
      bikeSharing: 0,
    })
    setGameLog([{ turn: 0, message: "Bienvenue à EcoCity! Vous êtes le nouveau responsable des transports." }])
    setCitizenQuote({
      text: "Bienvenue dans notre ville! Que ferez-vous pour améliorer nos transports?",
      type: "neutral",
    })
  }

  // Get status color based on value
  const getStatusColor = (value, isReversed = false) => {
    if (isReversed) {
      if (value <= 30) return "text-green-500"
      if (value <= 60) return "text-yellow-500"
      return "text-red-500"
    } else {
      if (value >= 70) return "text-green-500"
      if (value >= 40) return "text-yellow-500"
      return "text-red-500"
    }
  }

  // Calculate city visual representation
  const getCityVisualClass = () => {
    // Calculate the eco-friendliness of the city
    const ecoScore =
      cityInfrastructure.bikeLanes * 10 +
      cityInfrastructure.publicTransport * 8 +
      cityInfrastructure.greenSpaces * 12 +
      cityInfrastructure.pedestrianZones * 15 +
      cityInfrastructure.electricVehicles * 7 +
      cityInfrastructure.trainNetwork * 10 +
      cityInfrastructure.bikeSharing * 8 +
      cityInfrastructure.smartCity * 5 -
      cityInfrastructure.carRoads * 10

    // Return appropriate class based on eco score
    if (ecoScore >= 100) return "city-green"
    if (ecoScore >= 50) return "city-mixed"
    return "city-polluted"
  }

  // Modify some actions to give back budget
  // Find the action with id 11 (Covoiturage) and add a budget effect
  const actionIndex11 = actions.findIndex((a) => a.id === 11)
  if (actionIndex11 !== -1) {
    actions[actionIndex11].effects.budget = 50
  }

  // Find the action with id 18 (Augmentation tarifs transports) and increase its budget effect
  const actionIndex18 = actions.findIndex((a) => a.id === 18)
  if (actionIndex18 !== -1) {
    actions[actionIndex18].effects.budget = 150
  }

  // Find the action with id 23 (Réduction des transports publics) and increase its budget effect
  const actionIndex23 = actions.findIndex((a) => a.id === 23)
  if (actionIndex23 !== -1) {
    actions[actionIndex23].effects.budget = 100
  }

  // Add a new action that gives back budget
  actions.push({
    id: 26,
    title: "Péage urbain",
    description: "Instaurer un péage pour les véhicules entrant en ville",
    icon: <Car className="h-8 w-8 text-blue-600" />,
    cost: 200,
    effects: { pollution: -10, ecology: +5, satisfaction: -15, budget: +300 },
    category: "program-good",
  })

  // Update the Tabs component to include good and bad actions
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">EcoCity: Gestion des Transports</h1>
            <p className="text-muted-foreground">
            Ce n’est pas juste un jeu, c’est une prise de conscience sur le futur des villes et des mobilités !♻️
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => endGame("Nouvelle partie démarrée")} className="text-green-700 border-green-500">
              Nouvelle Partie
            </Button>
            <Badge variant="outline" className="text-lg px-3 py-1">
              <Building2 className="mr-1 h-4 w-4" /> Tour: {turn}/15
            </Badge>
            <Badge variant="outline" className="text-lg px-3 py-1">
              <CreditCard className="mr-1 h-4 w-4" /> Budget: {budget}€
            </Badge>
          </div>
        </div>

        {/* City Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                <span className={getStatusColor(pollution, true)}>Pollution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={pollution} className="h-3 mb-1" />
              <div className="flex justify-between text-sm">
                <span>Faible</span>
                <span>Élevée</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Leaf className="mr-2 h-5 w-5 text-green-500" />
                <span className={getStatusColor(ecology)}>Écologie</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={ecology} className="h-3 mb-1" />
              <div className="flex justify-between text-sm">
                <span>Faible</span>
                <span>Élevée</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                <span className={getStatusColor(satisfaction)}>Satisfaction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={satisfaction} className="h-3 mb-1" />
              <div className="flex justify-between text-sm">
                <span>Mécontents</span>
                <span>Satisfaits</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Citizen Quote */}
        <Alert
          className={`mb-6 ${
            citizenQuote.type === "positive"
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : citizenQuote.type === "negative"
                ? "border-red-500 bg-red-50 dark:bg-red-950"
                : "border-blue-500 bg-blue-50 dark:bg-blue-950"
          }`}
        >
          <div className="flex items-start">
            <Users
              className={`h-5 w-5 mr-2 ${
                citizenQuote.type === "positive"
                  ? "text-green-500"
                  : citizenQuote.type === "negative"
                    ? "text-red-500"
                    : "text-blue-500"
              }`}
            />
            <div>
              <AlertTitle
                className={`${
                  citizenQuote.type === "positive"
                    ? "text-green-700 dark:text-green-300"
                    : citizenQuote.type === "negative"
                      ? "text-red-700 dark:text-red-300"
                      : "text-blue-700 dark:text-blue-300"
                }`}
              >
              Voix des citoyens
              </AlertTitle>
              <img
                src={`/asset/${
                  citizenQuote.type === "positive"
                    ? ["perso1", "perso2", "perso3"][Math.floor(Math.random() * 3)]
                    : citizenQuote.type === "negative"
                      ? ["perso4", "perso5"][Math.floor(Math.random() * 2)]
                      : "perso4"
                }.gif`}
                className="mt-2 mb-2 w-24 h-24 object-cover rounded-lg shadow"
              />
              <AlertDescription className="mt-1 italic">"{citizenQuote.text}"</AlertDescription>
            </div>
          </div>
        </Alert>


        {/* Event Alert */}
        {eventActive && currentEvent && (
          <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-700 dark:text-amber-300">{currentEvent.title}</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">{currentEvent.description}</p>
              <div className="flex flex-wrap gap-2">
                {currentEvent.choices.map((choice, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleEventChoice(choice)}
                    className="border-amber-500 text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900"
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Game Over */}
        {gameOver && (
          <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <AlertTitle className="text-xl font-bold text-blue-700 dark:text-blue-300">Partie terminée</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4 text-lg">{winMessage}</p>
              <Button onClick={restartGame}>Nouvelle partie</Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        {!gameOver && !eventActive && (
          <Tabs defaultValue="infrastructure-good" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="infrastructure-good">Infrastructures Durables</TabsTrigger>
              <TabsTrigger value="infrastructure-bad">Infrastructures Polluantes</TabsTrigger>
              <TabsTrigger value="program-good">Programmes Écologiques</TabsTrigger>
              <TabsTrigger value="program-bad">Programmes Polluants</TabsTrigger>
            </TabsList>

            <TabsContent value="infrastructure-good" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions
                  .filter((a) => a.category === "infrastructure-good")
                  .map((action) => (
                    <Card
                      key={action.id}
                      className={`hover:shadow-md transition-shadow ${usedActions.includes(action.id) ? "opacity-50" : ""}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center">
                            {action.icon}
                            <span className="ml-2">{action.title}</span>
                          </CardTitle>
                          <Badge variant={action.effects.pollution < 0 ? "success" : "destructive"}>
                            {action.cost}€
                          </Badge>
                        </div>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center">
                            <AlertTriangle className="mr-1 h-4 w-4" />
                            <span className={action.effects.pollution < 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.pollution > 0 ? "+" : ""}
                              {action.effects.pollution}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Leaf className="mr-1 h-4 w-4" />
                            <span className={action.effects.ecology > 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.ecology > 0 ? "+" : ""}
                              {action.effects.ecology}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            <span className={action.effects.satisfaction > 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.satisfaction > 0 ? "+" : ""}
                              {action.effects.satisfaction}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleAction(action)}
                          disabled={budget < action.cost || usedActions.includes(action.id)}
                          className="w-full"
                        >
                          {usedActions.includes(action.id)
                            ? "Déjà utilisé"
                            : budget < action.cost
                              ? "Budget insuffisant"
                              : "Exécuter"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="infrastructure-bad" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions
                  .filter((a) => a.category === "infrastructure-bad")
                  .map((action) => (
                    <Card
                      key={action.id}
                      className={`hover:shadow-md transition-shadow ${usedActions.includes(action.id) ? "opacity-50" : ""}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center">
                            {action.icon}
                            <span className="ml-2">{action.title}</span>
                          </CardTitle>
                          <Badge variant={action.effects.pollution < 0 ? "success" : "destructive"}>
                            {action.cost}€
                          </Badge>
                        </div>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center">
                            <AlertTriangle className="mr-1 h-4 w-4" />
                            <span className={action.effects.pollution < 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.pollution > 0 ? "+" : ""}
                              {action.effects.pollution}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Leaf className="mr-1 h-4 w-4" />
                            <span className={action.effects.ecology > 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.ecology > 0 ? "+" : ""}
                              {action.effects.ecology}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            <span className={action.effects.satisfaction > 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.satisfaction > 0 ? "+" : ""}
                              {action.effects.satisfaction}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleAction(action)}
                          disabled={budget < action.cost || usedActions.includes(action.id)}
                          className="w-full"
                        >
                          {usedActions.includes(action.id)
                            ? "Déjà utilisé"
                            : budget < action.cost
                              ? "Budget insuffisant"
                              : "Exécuter"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="program-good" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions
                  .filter((a) => a.category === "program-good")
                  .map((action) => (
                    <Card
                      key={action.id}
                      className={`hover:shadow-md transition-shadow ${usedActions.includes(action.id) ? "opacity-50" : ""}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center">
                            {action.icon}
                            <span className="ml-2">{action.title}</span>
                          </CardTitle>
                          <Badge variant={action.effects.pollution < 0 ? "success" : "destructive"}>
                            {action.cost}€
                          </Badge>
                        </div>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center">
                            <AlertTriangle className="mr-1 h-4 w-4" />
                            <span className={action.effects.pollution < 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.pollution > 0 ? "+" : ""}
                              {action.effects.pollution}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Leaf className="mr-1 h-4 w-4" />
                            <span className={action.effects.ecology > 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.ecology > 0 ? "+" : ""}
                              {action.effects.ecology}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            <span className={action.effects.satisfaction > 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.satisfaction > 0 ? "+" : ""}
                              {action.effects.satisfaction}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleAction(action)}
                          disabled={budget < action.cost || usedActions.includes(action.id)}
                          className="w-full"
                        >
                          {usedActions.includes(action.id)
                            ? "Déjà utilisé"
                            : budget < action.cost
                              ? "Budget insuffisant"
                              : "Exécuter"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="program-bad" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions
                  .filter((a) => a.category === "program-bad")
                  .map((action) => (
                    <Card
                      key={action.id}
                      className={`hover:shadow-md transition-shadow ${usedActions.includes(action.id) ? "opacity-50" : ""}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center">
                            {action.icon}
                            <span className="ml-2">{action.title}</span>
                          </CardTitle>
                          <Badge variant={action.effects.pollution < 0 ? "success" : "destructive"}>
                            {action.cost}€
                          </Badge>
                        </div>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center">
                            <AlertTriangle className="mr-1 h-4 w-4" />
                            <span className={action.effects.pollution < 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.pollution > 0 ? "+" : ""}
                              {action.effects.pollution}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Leaf className="mr-1 h-4 w-4" />
                            <span className={action.effects.ecology > 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.ecology > 0 ? "+" : ""}
                              {action.effects.ecology}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            <span className={action.effects.satisfaction > 0 ? "text-green-500" : "text-red-500"}>
                              {action.effects.satisfaction > 0 ? "+" : ""}
                              {action.effects.satisfaction}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleAction(action)}
                          disabled={budget < action.cost || usedActions.includes(action.id)}
                          className="w-full"
                        >
                          {usedActions.includes(action.id)
                            ? "Déjà utilisé"
                            : budget < action.cost
                              ? "Budget insuffisant"
                              : "Exécuter"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Game Log */}
        <Card>
          <CardHeader>
            <CardTitle>Journal de bord</CardTitle>
          </CardHeader>
          <CardContent className="max-h-40 overflow-y-auto">
            <ul className="space-y-1">
              {gameLog
                .slice()
                .reverse()
                .map((entry, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-semibold">Tour {entry.turn}:</span> {entry.message}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
        {showBudgetWarning && <BudgetWarningPopup />}
      </div>
    </div>
  )
}

const BudgetWarningPopup = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-red-600 mb-4">Attention: Budget Négatif!</h2>
      <p className="mb-4">
        Votre budget est tombé à {budget}€. Vous devez prendre des mesures pour rétablir vos finances!
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
          <h3 className="font-semibold">Pollution</h3>
          <p className={getStatusColor(pollution, true)}>{pollution}%</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
          <h3 className="font-semibold">Écologie</h3>
          <p className={getStatusColor(ecology)}>{ecology}%</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
          <h3 className="font-semibold">Satisfaction</h3>
          <p className={getStatusColor(satisfaction)}>{satisfaction}%</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
          <h3 className="font-semibold">Budget</h3>
          <p className="text-red-500">{budget}€</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setShowBudgetWarning(false)}>Continuer</Button>
      </div>
    </div>
  </div>
)

