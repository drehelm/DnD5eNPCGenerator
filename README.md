<<<<<<< HEAD
# DnD5eNPCGenerator
=======
# D&D 5e NPC Generator

![D&D 5e NPC Generator](https://img.shields.io/badge/D%26D-5e-red)
![License](https://img.shields.io/badge/license-MIT-blue)

A comprehensive random NPC generator for Dungeons & Dragons 5th Edition campaigns. Create detailed NPCs with coherent characteristics, personality traits, and family relationships to enhance your tabletop roleplaying game.

## 🎲 Features

- **Complete NPC Generation**: Randomly generate NPCs with race, class, age, gender, personality traits, quirks, flaws, and family trees
- **Coherent Attributes**: NPCs have logically consistent characteristics based on their race, class, and age
- **Detailed Family Trees**: Generate family members with appropriate relationships and characteristics
- **Customization Options**: Specify generation parameters or randomize any aspect
- **Regeneration**: Regenerate specific NPC attributes while keeping others

## 🛠️ Technologies Used

- **Backend**: Node.js with Express.js
- **Frontend**: Vanilla JavaScript, HTML, and CSS
- **Data Storage**: JSON data files

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/drehelm/DnD5eNPCGenerator.git
   cd DnD5eNPCGenerator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📖 Usage

1. **Configure Generation Parameters**:
   - Select a race or leave as "Random"
   - Select a class or leave as "Random"
   - Choose gender or leave as "Random"
   - Specify age or leave empty for random
   - Adjust the number of traits, quirks, and flaws
   - Enable/disable family tree generation and set the depth

2. **Generate the NPC**:
   - Click the "Generate NPC" button
   - Review the generated NPC with all attributes and family members

3. **Regenerate or Copy**:
   - Click "Regenerate" to selectively regenerate specific attributes
   - Click "Copy" to copy all NPC details to your clipboard

## 📁 Project Structure

```
dnd5e-npc-generator/
├── data/                     # Data files for NPC generation
│   ├── classes.json          # D&D 5e classes
│   ├── familyTemplates.json  # Family structure templates
│   ├── flaws.json            # Character flaws
│   ├── names.json            # Names by race and gender
│   ├── quirks.json           # Character quirks
│   ├── races.json            # D&D 5e races
│   └── traits.json           # Personality traits
├── public/                   # Frontend assets
│   ├── css/                  # Stylesheets
│   ├── js/                   # Frontend JavaScript
│   └── index.html            # Main HTML page
├── src/                      # Backend source code
│   ├── api/                  # API routes and controllers
│   ├── generators/           # NPC generation logic
│   └── utils/                # Utility functions
├── package.json              # Project metadata and dependencies
└── server.js                 # Express server configuration
```

## 🧙‍♂️ Background

This D&D 5e NPC Generator was created to help Dungeon Masters quickly create detailed, coherent NPCs for their campaigns. The generator uses a complex system of relationships between attributes to ensure that each NPC feels realistic and consistent.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests to enhance the functionality.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Dungeons & Dragons](https://dnd.wizards.com/) for the amazing game system
- The D&D community for inspiration and support
>>>>>>> 315191e (Initial commit: D&D 5e NPC Generator)
