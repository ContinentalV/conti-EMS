const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle} = require('discord.js')
const openai = require("./../../openai")
const countTokens = require('./../../count-tokens')


module.exports = {
  data: new SlashCommandBuilder()
    .setName('test-open-ai')
    .setDescription('test'),
  async execute(interaction) {
/*
    const messagesTest = [`
Tu dois agir comme un expert en roll play gta 5, ainsi que dans le domaine hospitalier.
Je suis le patron de l'hopital actuellement j'aurai besoin que tu puisse me génerer 1 opération  cohérente realisable dans le rp gta 5
il faudra un juste milieu pour qu'on puisse realiser l'opération en rp, mais qu'on puisse s'entire que l'acteur ems connais son métier.
(par exemple l'opération doit dure entre 10 a 30 min max dans le rp contrairment a plusieurs heures dans la vrai vie)
Dans ce scenario la victime a pris un ou des impact de balles.
Voici différent exemple. Ces exemple sont bien mais il faudrait  enrichir un peu plus pour une meilleur immersion avec les contrainte ci dessus
Diagnostic : La victime présente des blessures par balle à l'abdomen et à l'épaule droite. Les radiographies montrent que les balles sont toujours dans le corps, ayant perforé la paroi abdominale sans toucher d'organes vitaux, et ont provoqué une fracture de l'omoplate.
Examen pré-opératoire : Les médecins effectuent une échographie et une tomodensitométrie pour localiser précisément les balles et évaluer les dégâts internes. Ils stabilisent également la pression sanguine de la victime et administrent des antibiotiques pour prévenir les infections.
Opération : L'opération dure environ 20 minutes. Les chirurgiens ouvrent l'abdomen, extraient la balle en utilisant des pinces spéciales, puis réalisent une petite incision pour retirer celle de l'épaule. Ils réparent les tissus endommagés et fixent la fracture de l'omoplate avec des vis.
Post-opération : La victime est placée en salle de réveil, où elle est surveillée pour toute complication. Elle devra rester à l'hôpital pendant quelques jours pour récupérer, suivie d'une rééducation pour regagner sa force et sa mobilité.

`]
*/


    const messagesTest = [`
    
"Génère une scène d'opération médicale réaliste dans le cadre d'une simulation de rôle GTA 5 à l'hôpital. Le patient doit avoir des blessures graves, mais il doit survivre à la fin de l'opération". La scène doit inclure les étapes suivantes :
Que font les ambulancier qui arrive sur le lieux de la scene. 
diagnosctic
pre op 
op 
post op 
complication ? (falcultatif) 
survie du patient : obligatoire 
detailler : terme tehcnique, nom d'appareille usensitle , nom d'operation
temps de realisation dans le rp: entre 10 et 30 minute
""""Voici différent exemple"""""
###############
Diagnostic : La victime présente des blessures par balle à l'abdomen et à l'épaule droite. Les radiographies montrent que les balles sont toujours dans le corps, ayant perforé la paroi abdominale sans toucher d'organes vitaux, et ont provoqué une fracture de l'omoplate.
Examen pré-opératoire : Les médecins effectuent une échographie et une tomodensitométrie pour localiser précisément les balles et évaluer les dégâts internes. Ils stabilisent également la pression sanguine de la victime et administrent des antibiotiques pour prévenir les infections.
Opération : L'opération dure environ 20 minutes. Les chirurgiens ouvrent l'abdomen, extraient la balle en utilisant des pinces spéciales, puis réalisent une petite incision pour retirer celle de l'épaule. Ils réparent les tissus endommagés et fixent la fracture de l'omoplate avec des vis.
Post-opération : La victime est placée en salle de réveil, où elle est surveillée pour toute complication. Elle devra rester à l'hôpital pendant quelques jours pour récupérer, suivie d'une rééducation pour regagner sa force et sa mobilité.

Préparation :
1. L'équipe médicale EMS se prépare en portant des équipements de protection appropriés.
2. La victime est transportée rapidement à la salle d'opération spécialement aménagée à l'hôpital.

Opération :
1. Le chirurgien EMS examine les blessures de la victime pour identifier les balles et évaluer les dommages.
2. Un anesthésiste EMS administre une anesthésie locale pour minimiser les douleurs de la victime.
3. Le chirurgien effectue des incisions précises pour accéder aux balles et retire celles-ci avec des instruments adaptés.
4. Les tissus endommagés sont nettoyés et les saignements contrôlés avec des techniques d'hémostase rapide.
5. Si nécessaire, le chirurgien réalise des sutures pour réparer les tissus lésés et fermer les incisions.
6. Tout au long de l'opération, l'équipe médicale EMS surveille attentivement les signes vitaux de la victime pour s'assurer de sa stabilité.

Après l'opération :
1. La victime est transférée en salle de réveil où son état est continuellement surveillé.
2. Après un court moment de récupération, la victime est prête à quitter l'hôpital, avec des instructions de suivi médical et des médicaments si nécessaires.

Dans ce scénario, l'intervention chirurgicale a été simplifiée pour s'adapter au format du jeu et dure environ 20 minutes maximum, contrairement à plusieurs heures dans la réalité. Cependant, les étapes principales de l'opération et les compétences de l'acteur EMS sont mises en avant pour démontrer son expertise dans le domaine hospitalier.
En tant qu'expert en roll play GTA 5 et dans le domaine hospitalier, je peux vous proposer une opération cohérente réalisable dans le RP.

Scénario : La victime a pris plusieurs impacts de balles.

 Préparation de l'opération :
- L'équipe médicale EMS est alertée et se prépare rapidement pour l'opération.
- La victime est immédiatement placée sur un brancard et transférée dans la salle d'opération.
- L'acteur EMS procède à une évaluation initiale de l'état de la victime pour déterminer l'urgence de l'intervention.

 Anesthésie :
- L'anesthésiste administre une anesthésie générale pour garantir que la victime reste inconsciente et sans douleur pendant l'opération.
- Le personnel médical surveille en permanence les signes vitaux de la victime pendant l'anesthésie.

 Intervention chirurgicale :
- Le chirurgien commence par localiser les blessures par balles à l'aide d'examens radiologiques tels que des radiographies ou scanner.
- Il réalise ensuite une ouverture chirurgicale afin d'accéder aux organes touchés par les balles.
- Les projectiles sont retirés avec précaution pour éviter d'endommager davantage les tissus environnants.
- Si nécessaire, le chirurgien peut effectuer des sutures pour réparer les dommages causés par les balles.

 Contrôle et fermeture :
- Le chirurgien effectue un contrôle minutieux pour s'assurer qu'aucune balle n'a été oubliée lors de l'intervention.
- Les organes touchés sont évalués pour s'assurer qu'ils fonctionnent correctement.
- Si les organes sont gravement endommagés, une intervention plus complexe peut être nécessaire, mais dans ce cas, l'opération se limitera aux opérations de routine.

 Réveil et transfert en salle de surveillance post-opératoire :
- Une fois l'opération terminée, l'équipe médicale surveille de près la récupération de la victime.
- La victime est ensuite transférée dans la salle de surveillance post-opératoire pour une observation continue jusqu'à son réveil complet.
 ############################   `]

    const gptMessages = []
    const maxTokens=4096
    let totalTokens = 0

messagesTest.forEach((msg) => {
  const tokens = countTokens(msg )
  console.log(tokens)
  if(totalTokens + tokens < maxTokens){
    totalTokens += tokens;
    gptMessages.push({
      role:   "user" ,
      content: msg
    })
  }
})
const response = await openai(gptMessages)
    console.log(response)


  }
}