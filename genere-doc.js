const fs = require('fs');
const path = require('path');

const botDirectory = './commands'; // Spécifiez le chemin vers le répertoire de votre bot
const documentationFilePath = 'documentation.md';

const specialComments = [];

// Fonction récursive pour parcourir les fichiers et sous-répertoires
function traverseDirectory(directory) {
   // console.log(directory)
    const files = fs.readdirSync(directory);

    for (const file of files) {
        //console.log(file)
        const filePath = path.join(directory, file);

        if (fs.statSync(filePath).isDirectory()) {
            // Si c'est un répertoire, continuez à parcourir récursivement
            traverseDirectory(filePath);
        } else if (filePath.endsWith('.js')) {
            // Si c'est un fichier JavaScript, lisez son contenu
            const sourceCode = fs.readFileSync(filePath, 'utf-8');
           // console.log(sourceCode)

            // Trouvez tous les commentaires spéciaux dans le fichier
            const comments = sourceCode.match(/\/\*\*([\s\S]*?)\*\//g);
            //console.log(comments)

            if (comments) {
                specialComments.push(...comments);
            }
        }
    }
}

// Commencez la traversée du répertoire du bot
traverseDirectory(botDirectory);

console.log(specialComments)

if (specialComments.length > 0) {
    // Créez un fichier Markdown avec les informations extraites
    const markdownContent = specialComments.map((comment) => {
        // Analysez le commentaire spécial pour extraire les informations
        const commandInfo = {};

        const matches = comment.match(/@command\s+([\s\S]*?)\n/i);



     //   console.log(matches)
        if (matches) {
            commandInfo.command = matches[1].trim();
        }

        const descriptionMatches = comment.match(/@description\s+([\s\S]*?)\n/i);

        if (descriptionMatches) {
            commandInfo.description = descriptionMatches[1].trim();
        }

        const usageMatches = comment.match(/@usage\s+([\s\S]*?)\n/i);

        if (usageMatches) {
            commandInfo.usage = usageMatches[1].trim();
        }

        // Générer le contenu Markdown
        return `
## Commande ${commandInfo.command}

${commandInfo.description}

Exemple d'utilisation :
\`\`\`
${commandInfo.usage}
\`\`\`
    `;
    }).join('\n');

    // Écrivez le contenu Markdown dans le fichier de documentation
    fs.writeFileSync(documentationFilePath, markdownContent);

    console.log('Documentation générée avec succès.');
} else {
    console.log('Aucun commentaire spécial trouvé.');
}
