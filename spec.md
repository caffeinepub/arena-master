# Arena Master

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Splash screen with gladiator logo and fiery branding
- Tournament system: browse, join solo or as team, view details
- Leagues system with divisions and progression
- Points/coins system: earn coins for wins, placements
- Global and local leaderboards with rank display
- Simulated wallet: virtual coin balance, deposit (dummy), withdraw as reward
- In-app notification center: match alerts, results, reward alerts
- User profile & stats: wins, losses, coins, rank, tournaments played, kill count
- Admin panel: create/edit tournaments, manage rewards, view/manage players
- Dummy payment placeholders for Easypaisa and JazzCash
- Role-based access: player vs admin

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - User profiles with stats (wins, losses, coins, rank, tournamentsPlayed)
   - Tournament CRUD (name, game, type, prizePool, startTime, status, participants)
   - Team management (create team, join team, leave team)
   - Tournament registration (solo/team)
   - Match results and scoring
   - Leaderboard queries (global, local by coins/wins)
   - Wallet: balance, deposit coins, withdraw coins, transaction history
   - Notification records per user
   - Admin-only endpoints: create tournament, update results, manage users
   - Authorization: admin and player roles

2. Frontend:
   - Splash/loading screen with gladiator logo
   - Bottom nav: Home, Tournaments, Leaderboard, Wallet, Profile
   - Home: featured tournament, news banner, quick stats
   - Tournaments list: filter by status, join flow (solo/team)
   - Tournament detail: prize breakdown, participants, countdown timer
   - Leaderboard: tabs for global/local, animated rank rows
   - Wallet: balance card, deposit modal (dummy), withdraw modal, transaction history
   - Profile: avatar, stats cards, badge display, tournament history
   - Notification panel/drawer
   - Admin panel: accessible via profile menu for admin role
   - Admin: create tournament form, manage players table, set results
   - Payment placeholders: Easypaisa/JazzCash buttons in deposit modal (simulated)
