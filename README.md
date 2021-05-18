<div align="center">
    <h3>🔦 3D mapping using a LiDAR scanner (Engineering project)</h3>
    <a href="https://github.com/theovidal/mapping/releases/latest">Latest release</a> — <a href="./LICENSE">License</a> 
</div>

## 🌈 How it works

See [project file](./assets/docs/Dossier%20Projet%202021%20-%20CAPITANIO%20Kylian,%20VIDAL%20Théo.docx) (in french).

## 💻 Development

Clone the repository from GitHub on your local machine : (this requires Git to be installed)

```bash
git clone https://github.com/highest-app/template.git  # Using HTTP
git clone git@github.com:highest-app/template          # Using SSH
```

Install the required dependencies using your favorite package manager :

```bash
npm install   # Using NPM
yarn install  # Using Yarn
```

Then, run the renderer process using the `dev` script, and the Electron app with `start` :

```bash
npm run dev  # Using NPM
yarn dev     # Using Yarn

npm run start  # Using NPM
yarn start     # Using Yarn
```

A web server will start with hot reload enabled, perfect to develop.

### Building the app

To get a built version of the renderer ready to be served by a HTTP server, use the `build` command :

```bash
npm run build  # Using NPM
yarn build     # Using Yarn
```

Files will be generated in the `dist` folder.

To build the app, use the GitHub action that uses electron-builder or the software itself:

```bash
electron-build --windows --mac --linux
```

To upload the [hardware script](./hardware/hardware.ino) on your card, open it in your Arduino IDE.

## 📜 Credits

- Built by [Théo VIDAL](https://github.com/theovidal) and Kylian CAPITANIO
- Made in Lycée Polyvalent J.-M. Carriat, 01000 Bourg-en-Bresse, France
