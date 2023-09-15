const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder} = require('discord.js')
const openai = require("./../../openai")
const countTokens = require('./../../count-tokens')
const wait = require('node:timers/promises').setTimeout;


module.exports = {
  data: new SlashCommandBuilder()
    .setName('test-open-ai')
    .setDescription('test')
      .addStringOption(option =>
      option
          .setName("theme")
          .setDescription('Selectionner le theme du scenario')
          .setRequired(true)
          .addChoices(
              {name: "par balle basique", value:"par balle"},
                      {name: "Accident de voiture", value:"accident de voiture"},
                      {name: "faim/soif", value:"deshydrate"},
          ))

  ,
  async execute(interaction) {
    const {member, user, options, guild, client} = interaction;
   // if(member.id !== "465144095996772369") return interaction.reply({content: "EUH NON DSL FAUT PAYER LA TA CRU JE VAIS PAYER POUR TOI ? "})
   await interaction.deferReply()
    let theme = options.getString('theme')
    console.log("THEME => " + theme)



    const gptMessages = []
    const maxTokens=4096
    let totalTokens = 0


    const test = `
"Thème de l'opération : blessure ${theme},
Degré de la blessure  , superficiel,  
Blessure: perforation du poumont droit, la balle n'a pas traverser, et une balle est ressorti sans touché d'organe vitale
Pour le personnel utiliser les terme medicaux, metier etc..
Arrivée des ambulancier :
À leur arrivée sur les lieux, les ambulancier  découvre la victime présentant un traumatisme abdominal par arme à feu. La situation nécessite une intervention médicale immédiate pour éviter toute aggravation.
#Premiers soins :# Les professionnels de santé examinent rapidement la blessure [insérez ici le thème] et constatent [insérez ici les détails médicaux pertinents]. Ils mettent en place des mesures d'urgence pour stabiliser la situation, [indiquez les etape généralement réaliser dans ce cas la]
#Diagnostic :# Le diagnostic initial révèle [insérez ici les constatations médicales spécifiques]. Des examens complémentaires, tels que[indiquez les exament qui  sont réalisés pour évaluer la gravité de la blessure.]
#Pré-opération :# Avant la chirurgie, [insérez ici les étapes préliminaires médicales, tels que les tests sanguins, les antibiotiques pour prévenir les infections, et tout autre etape pertinente.].
#Opération :# Le patient est préparé pour [insérez ici le type spécifique d'opération, par exemple : une chirurgie orthopédique, une chirurgie exploratoire, ou tout autre opération cohérente.]. Le chirurgien [insérez ici la procédure chirurgicale spécifique, y compris les outils et les appareils médicaux utilisés].[indiquer la compléxité de l'operation], visant à [insérez ici l'objectif de l'opération, comme la réparation d'une fracture, l'extraction d'un projectile, ou tout autre scenario cohérent.].
#Post-opération :# Après la chirurgie, le patient est surveillé attentivement en salle de réveil. [Insérez ici les étapes post-opératoires, telles que la rééducation, la gestion de la douleur, etc.]. Bien que les complications puissent survenir, une intervention rapide et une chirurgie réussie offrent de bonnes perspectives de rétablissement complet. Le suivi médical continu sera essentiel pour garantir une récupération optimale."

Genere une nouvelle operation ${theme} en suivant le model absolument la structure du model ci dessu et instruction ci dessu ,
Tu remplacera les professionel de santé par les vrai specialité des différent metier qui interviendront
l'opération doit être realiste
 tu choisira le degres de la blessure  puis tu remplacera tout les # par ** et tu separera chaque paragraphe d'un saut de ligne
`
    const tokens = countTokens(test)
    console.log("TOKEN" +tokens)
    if(totalTokens + tokens < maxTokens) {
      totalTokens += tokens;
      console.log("TOTAL TOKEN " + totalTokens)

    }
    const response = await openai(test);
    await wait(4000)

    console.log(response.split('\n'))
    const embed = new EmbedBuilder()
        .setTitle('Scénario ' + theme)
        .setColor('DarkAqua')
        .setDescription(response)
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL({dynamic:true}))
        .setFooter({text: "Request by: " + member.nickname, iconURL: member.displayAvatarURL({dynamic:true})})



    await interaction.editReply({embeds: [embed]})


  }
}