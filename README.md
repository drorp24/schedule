# Schedule

View & modify shipping delivery schedule.

## Installation

To run the app locally, clone the following repos, each into its own directory:

- Ice_Ring_Gateway_Interface
- Ice_Ring_UI

Build the Ice_Ring_Gateway_Interface API in its directory by doing

```bash
npm install
```

Build the Ice_Ring_UI app in its own directory by doing

```bash
yarn
```

Still in the Ice_Ring_UI directory, run the app by keying:

```bash
yarn both
```

The app will open at localhost:3000.

## Guidelines & tools

The following are some of the principles, tools developed and libraries used in building this app.
It is highly recommended to keep using them going forward as the app grows.

### Design language & principles

This app adheres to Material Design latest guidelines. material-ui's newest v5 was selected for its extensive support of dark mode and i18n.

In order to maintain a consistent UI and save tons of CSS code in the way, the app is heavily theme-based.

All css is javascript-based, which allows styling to be composed naturally and respond to state changes without stacking classNames on top of each other.

To keep with the Material Design spirit, icons are animated and css properties are transitioned whereever it is meaningful.

### Data normalization and caching (redux)

As expected from an app that links together as assortment of entities, all fetched entities are normalized in the redux store. In addition:

- all major selectors are implemented with custom hooks
- fetches and thunks are streamlined using createAsyncThunk
- queries are cached to prevent unnecessary fetching

### Routing

The app is built to make it easy to add functionality. To that end,

- routes are completely configurable
- so is side drawer menu
- react router v5 was used for the routing

### Communication & information

- all user messages are conveyed using snackbars, with optional action buttons
- oversized tooltips enable viewing info without losing context
- error boundaries enable failures to be graceful

### Authorization

- Login
- Logout
- Protected routes
- fakeUserApi enables to customize the UI even if the API isn't ready yet

### Internationalization

- declarative, real dual direction
- 'en' and 'he' locales supported

### Lists virtualization

To enable lists to scroll smoothly and endlessly without the user needing to click for the next page, all lists are virtualized.

- react-window was used for lists virtualization
- in addition, the lists are config-based, so that any new list would be able to be virtualized with no hassle
- lazy loading (aka endless scrolling) is not supported. It will be, if lists become long.

### visjs-timeline

visjs-timeline was chosen for its ability to do any CRUD operation required, in a way that enables to persist such modifications.
As an added bonus, it enables to zoom into a gantt, shift tasks in time and let them arrange themsleves automatically in the right lane, and some other cool features.

The challenge is that it operates on the DOM directly without React's intervention or awareness. While this challenge was resolved, it should be taken into account whenever this part of the app gets changed.
