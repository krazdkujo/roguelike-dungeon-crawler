1. Core Concept
A multiplayer, browser-based, asynchronous roguelike dungeon crawler where players team up to defeat a final boss for loot. The game emphasizes resource management, deep character progression through a complex skill system, and strategic combat.

2. Game Type & Platform
Genre: Roguelike Dungeon Crawler with JRPG combat mechanics.

Platform: Browser-based.

Players: 1-4 players per dungeon instance.

3. Session & Player Structure
Pacing: Asynchronous gameplay.

Session Timer: Players choose the length of an asynchronous timer for their turns. Options include: 1 minute, 15 minutes, 1 hour, 4 hours, and 1 day.

Multiplayer: Players can form parties of up to four to tackle a dungeon together.

4. Game World & Gameplay Loop
Scene-by-Scene Progression: The game progresses through static scenes (Base, World Map, Town, Dungeon rooms) without any character-controlled movement or exploration.

Player Base: A home base that players can build up over time (this system will be designed in more detail later).

World Map: A central hub from which players can navigate to other areas.

Dungeons: Players can view a list of available dungeon lobbies, showing the host, difficulty, current player count, and the asynchronous timer setting.

Town: A service hub where players can buy/repair equipment, heal the party, and manage their roster.

Dungeon Structure & Generation:

Dungeons are randomly generated for each new run.

Composition: A dungeon consists of 6-12 rooms. A typical layout includes 5-6 combat encounters and 1 non-combat encounter.

Encounters: Rooms can contain either combat encounters or non-combat challenges that players can attempt to overcome using their skills.

Difficulty: Encounters become progressively harder as the party advances deeper into the dungeon, culminating in a final boss fight.

Off-Dungeon Activities: Characters from the roster who are not in an active dungeon can be assigned to tasks:

Missions: Send characters on missions of varying difficulty. Success can yield components for crafting, materials for base building, or quest progress.

Training: Assign characters to train, improving their skills over time.

5. Character & Progression
Character Roster: Players can build and manage a roster of multiple characters. The characters they don't take into dungeons can be assigned to missions or training.

Character Creation: Players create a character by choosing a traditional fantasy Race (e.g., Human, Elf, Dwarf) and a starting Archetype which determines their initial skills.

Character Progression:

Skill-Based System & Emergent Classes: There are no fixed classes. A character's role is defined by the skills and abilities they equip. Combining skills from different disciplines creates emergent classes (e.g., equipping Warrior and White Magic skills creates a "Paladin" playstyle; combining White and Black Magic skills can create a "Necromancer").

Skill Dependencies: The system features a complex web of skills. Advanced abilities have prerequisites based on the level of foundational skills (e.g., Fireball might require Black Magic Lv. 2; a Shield Spell might require White Magic Lv. 3 and Defense Lv. 2).

Skill Leveling:

Skills level up from 1 to 50 through use.

Each level in a skill provides a +1 modifier to be used in relevant calculations (e.g., Level 1 = +1, Level 50 = +50).

The experience required to gain the next skill level follows an exponential curve, making later levels significantly harder to achieve.

Combat System:

Features a menu-driven, turn-based JRPG combat system.

Damage Formula: Damage and other combat effects are calculated using formulas that incorporate modifiers from all relevant skills. Higher skill levels directly result in more powerful outcomes.

Turn Order: All players in the party choose their actions for the turn. Once all players have locked in their choices, the actions execute. Then, all enemies take their turn. This cycle repeats.

Enemies: The enemy pool consists of traditional fantasy archetypes (goblins, orcs, etc.). Enemies are built using the same skill system as players and can possess unique passive abilities.

6. Objective & Rewards
Main Goal: Progress deep enough into the randomly generated dungeon to find and defeat the final boss.

Loot System:

Beating the boss yields the maximum loot for that dungeon run.

Loot rarity and quality are determined by the dungeon's difficulty level and the number of players in the party.

7. Failure & Consequences
Downed State: If a player's health reaches zero, they are "downed."

Party Wipe: If all players in the party are downed at the same time, the party "wipes."

Permadeath: A party wipe results in the loss of the characters used for that run and all the gear they were equipped with.

Retreat: Players can choose to retreat from a dungeon at any time when not in an encounter. If they do, they forfeit half of the value of all loot they have collected during that run.

8. Google Scope Plans V1 (MVP Definition)
This section outlines the specific information required to create a focused Minimum Viable Product (MVP) for the development agent team.

8.1. Onboarding & Initial Setup
Account Creation: The initial screen will be a sign-up/login form. New players will create an account by providing a unique username and a password.

First Character: After logging in for the first time, the player is directed to the Town screen to choose their first character by selecting a Race and a starting Archetype.

8.2. Party & Lobby Management
Hosting: One player acts as the "host" by creating a new dungeon lobby from the World Map.

Joining a New Lobby: When a player joins a lobby that has not yet started, they are taken to a "waiting room" screen. The game begins when the host starts the match or the party is full.

Joining a Run in Progress: If a player leaves a dungeon mid-run, their slot opens up. Another player can join the active dungeon and will be able to participate starting from the next turn.

8.3. Asynchronous Rules
Timer Expiration: When a player's turn timer expires during a combat encounter, their character will automatically perform a default "Defend" action for that turn.

8.4. Combat Flow & Resolution
Turn Resolution: The player turn phase ends and the enemy turn phase begins once every player in the party has either submitted their action or had their timer expire.

Action Order: Player actions within the turn resolve in an order determined by the character's relevant skill levels or passive abilities. For the MVP, this will be based on the 'Speed' skill. The character with the highest 'Speed' skill level acts first.

Action Lock-in: After selecting an action, the player is "locked in." However, they can choose to unlock their action and select a new one at any time before the turn resolves.

Action Secrecy: By default, players cannot see which actions their allies have selected.

Action Failure Feedback:

Proactive: The UI will grey out and disable buttons for actions that cannot be taken (e.g., a skill the player lacks the MP for).

Reactive: If an action fails upon execution (e.g., an attack misses), a "Miss!" message will be displayed over the target.

8.5. Character Management
Character Sheet UI: Players can access a dedicated "Character Sheet" screen from the Town. This screen will have tabs or sections for:

Equipment: Showing currently equipped items.

Skills: Listing all foundational skills and their current levels/XP.

Abilities: Showing all unlocked active abilities. Players can "equip" abilities to make them available in the combat menu. For the MVP, all unlocked abilities are automatically equipped.

Skill Experience: Every use of a skill grants XP for that skill.

Success vs. Failure: Successful actions (e.g., an attack that hits) grant more XP than failed actions (e.g., an attack that misses). For the MVP, a simple "10 XP for success, 2 XP for failure" rule can be used.

8.6. System Logic & State Management
Dungeon Generation: The dungeon's layout, encounters, and enemies are randomly generated at the moment the party "loads in" (enters the dungeon) for the first time.

Disconnection Handling: A player disconnection is treated as being AFK. Their character remains in the dungeon, and their turn timer continues to run. If the timer expires, they will auto-defend. A player can reconnect and resume their run at any time before it ends.

Loot Save Point: Loot is saved to a player's permanent inventory as the final step of the server-side logic for a "Victory" or "Retreat" event. This happens after the dungeon's status is set to "Complete" to ensure data integrity.

8.7. User Experience & Data Flow
UI Refresh: The game interface should automatically check for updates from the server (Airtable) every few seconds. If a change in the game state is detected (e.g., another player has acted), the UI should refresh to display the new information without requiring a manual page reload.

8.8. Loot & Economy
Loot Generation: After a successful encounter, each participating player receives their own individual loot. The items are generated from a loot table, and each player's roll is unique.

Temporary Storage: Loot acquired during a dungeon run is held in a temporary party inventory.

Value Calculation:

Every item has a base "Sell Price" in gold.

The "Buy Price" for items from a vendor is always 2x the Sell Price.

An item's Sell Price is modified by its rarity, prefixes, suffixes, and any special abilities it may have.

Retreat Penalty: When a party retreats, the total Sell Price of all items in the temporary party inventory is calculated. The party forfeits half of that total value.

Starting Economy & MVP Costs: Players start with 0 gold. For the MVP, all economic transactions (buying/selling in the shop) are functionally free. The SellPrice field on items should be implemented as a placeholder, but the game logic will not require players to spend or gain gold.

8.9. End-of-Run Summary & Resolution
Post-Encounter Summary: After each combat encounter, a summary screen appears. It details all skills used by the player's character during the encounter and the specific XP gained for each.

Victory (Boss Defeated):

A final "Victory" summary screen is displayed, showing all loot acquired and a summary of all skills leveled up during the run.

The character's name and the completed dungeon are recorded on a leaderboard.

The player is then returned to the Town screen.

Defeat (Party Wipe):

A "Defeat" summary screen is displayed, showing a full summary of what was lost (the character and all equipped gear).

The character's name and the room number they reached are recorded on a leaderboard.

The player is then returned to the Town screen.

8.10. Core Gameplay Loop & Initial Content
Minimum Loop Definition: Town -> Join Dungeon -> One Combat Encounter -> Post-Encounter Summary -> Get Loot -> Victory/Defeat Screen -> Return to Town.

Starter Characters:

Human Recruit (Knight): Starts with Defense Lv. 2, Speed Lv. 1, and a "Shortsword" item.

Elf Acolyte (Mage): Starts with Black Magic Lv. 2, Speed Lv. 1, and a "Wooden Staff" item.

Dwarf Scout (Ranger): Starts with Archery Lv. 2, Speed Lv. 2, and a "Shortbow" item.

Starter Enemy (Goblin):

Skills: Defense Lv. 1, Speed Lv. 1.

Abilities: Goblin Strike (a basic attack).

Unique Passive: Tough Hide (provides a small defensive bonus, implemented as base armor for the MVP).

8.11. User Interface (UI)
Town Screen: Buttons: [World Map], [My Roster], [Shop], [Recruit].

World Map Screen: A list of available dungeons showing: [Dungeon Name], [Players: X/4], [Join Button].

Character Sheet Screen: A dedicated screen with tabs for Equipment, Skills, and Abilities.

Combat Screen:

Layout: Enemy info on top, party info on the bottom, action menu for the active player.

Action State: Once an action is selected, the menu is replaced by a "Locked in: [Action Name] - [Change Choice]" display.

Targeting: To use a skill on a target, the player first clicks the skill button. Then, all valid targets (enemies or allies) become highlighted and clickable. Clicking a target confirms the action.

Summary Screen: A screen for Post-Encounter, Victory, and Defeat outcomes.

8.12. Visual Style
Theme: Top-Down SNES JRPG.

UI Windows: Dark blue background with a light-blue border.

Font: A web-safe pixel font (e.g., "Press Start 2P").

Menus: Use a ► cursor to indicate selection.

Art: Use simple colored squares as placeholders for characters and enemies in the MVP.

8.13. Technical Stack & Data Models
Frontend: HTML, CSS, JavaScript.

Backend/Automation: N8N.

Database: Airtable.

Data Storage Preference: Where possible, complex data should be stored in a single field using JSON format to maintain a clean table structure.

Data Structure (Airtable Tables):

Players: PlayerID, Username, Password (hashed), Gold.

Characters: CharacterID, OwnerPlayerID, Name, Race, HP, MP, Skills (JSON: {"Speed": 1, ...}), Equipment (JSON: {"weapon": "ItemID_123", "armor": "ItemID_456"}).

Dungeons: DungeonID, Status, Players, CurrentRoom, TurnTaker, TemporaryLoot (JSON).

Items: ItemID, Name, Type, Stats (JSON: {"damage": 5, "defense": 2}), SellPrice.

Leaderboard: EntryID, CharacterName, Outcome (e.g., "Victory"), Metric (e.g., "Cleared Dragon's Lair" or "Reached Room 5").

8.14. MVP Scope (Explicitly Out)
Player Base building, Missions, Training, Crafting.

Full 6-12 room dungeons and non-combat encounters.

Full skill tree.

Social Systems: Friendship levels or other mechanics for revealing ally actions are out of scope for the MVP.

Ability Slot Limits: The UI will exist for "equipping" abilities, but for the MVP, there will be no limit to how many can be equipped.

Permadeath: For the MVP, characters and gear will NOT be permanently lost on defeat. This will be implemented in a later version.