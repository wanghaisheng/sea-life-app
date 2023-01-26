# Vie Marine

## Getting Started

> **Prerequisites** <br>
> Node.js

```bash
# Copy env file and update it
cp .env.local.example .env.local

npm install --global yarn
yarn install
yarn dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

---

<br>

## Firebase

Firebase is used for authentication and database and functions.
We can use the emulator to test locally.

### Installation

```bash
npm install -g firebase-tools
npx firebase login
npx firebase use sea-life-app # (optional)

# Select Authentication, Functions, Firestore
npx firebase init emulators
# Get current extension configuration
npx firebase ext:export # (optional)
```

### Functions

```bash
# Compile functions automatically to test in local
npm run build:watch --prefix functions # (open a separate terminal window)

# Deploy to cloud
npx firebase deploy --only functions # all functions
npx firebase deploy --only functions:group-updateCountOnGroupCreate # single function
```

### Database

```bash
# Update env variable
# NEXT_PUBLIC_FIREBASE_EMULATOR=true

# Start emulator with existing local data
npx firebase emulators:start --import ./firebase_export/

# Start emulator without cloud function and UI to make it work in offline
npx firebase emulators:start --only firestore --import ./firebase_export/

# Save the current local data to be able to restore it later
npx firebase emulators:export ./firebase_export
```

## Algolia

### Synchronize Algolia data

> **Prerequisites** <br>
> Download service account key file: https://console.firebase.google.com/u/0/project/sea-life-app/settings/serviceaccounts/adminsdk <br>
> Upload the file to the root of the project and rename it to `sea-life-app-firebase-adminsdk.json`

```bash
npm install -g firestore-algolia-search
npx firestore-algolia-search

What is the Region? europe-west1
What is the Project Id? sea-life
What is the Algolia App Id? TIXD5TTYDU
What is the Algolia Api Key? { ALGOLIA_SEARCH_ADMIN_KEY }
What is the Algolia Index Name? species
What is the Collection Path? species
What are the Fields to extract? id,scientific_name,common_names,photos
What is the Transform Function? { empty }
What is the path to the Google Application Credential File? ./sea-life-app-firebase-adminsdk.json
```

Change extracted field in **firestore extension** :
https://console.firebase.google.com/project/sea-life-app/extensions/instances/firestore-algolia-search?tab=config

## Performances

### Bundle Analyzer

```bash
yarn analyze
```

## Build and publish for Google Play Store

### 1. Build using Bubblewrap (recommended)

```bash
# Install bubblewrap
npm install -g @bubblewrap/cli

mkdir sea-life-android
cd sea-life-android
bubblewrap init --manifest=https://sea-life.vercel.app/manifest.json
bubblewrap build
```

### Other ways to build:

**Using [pwabuilder.com](https://pwabuilder.com)**

- Enter the URL of the PWA (https://sea-life.vercel.app/)
- Click on "Package For Stores" and "Android"

**Using capacitor (only static pages)**

```bash
# Build
yarn build-mobile

# If you are on WSL2, you need to copy the build folder to your windows partition and open the folder with Android Studio
sudo rm -rf /mnt/c/Users/louis/OneDrive/Documents/git/sea-life/android
sudo cp -R ./android /mnt/c/Users/louis/OneDrive/Documents/git/sea-life/android

# If you are on windows, just execute the following command
npx cap sync
npx cap open android
```

### 2. Publish on Google Play Store

- Go to https://play.google.com/console/developers
- Select sea-life
- Go to "Release" > "Production" > "Create new release"
- Upload aab file and fill the form

<br>

# Other

## Features

- Breadcrumb for ancestors
- Similar species list
- Favorite list management
- Update life information (photos, text...)
- Display conservation status
- Improve search filters (shape, colors...)
- Improve text search including family names

## Improvement

- Static page only for species info
- Etoile de mer rouge doesnt appear in group:faune and type:species ?
- Rules for storage and firestore (prevent auth null)

## Other commands

```bash
npx kill-port 8080
```

## Archive code

#### Get blob from external url and upload to storage

```ts

// Back
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url } = req.body;
  const blob = await fetch(url).then((r) => r.blob());

  res.setHeader("Content-Type", blob.type);
  const buffer = await blob.arrayBuffer();
  res.send(Buffer.from(buffer) as any);
}

// Client
const blob = await fetch("http://localhost:3000/api/getINaturalistImage", {
  method: "POST",
  mode: "cors",
  cache: "default",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
}).then((res) => res.blob());

...

const storageRef = ref(storage, `${filePath}.${extension}`);
await uploadBytes(storageRef, blob);
```
