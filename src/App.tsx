import { createSignal } from "solid-js";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import html from "solid-js/html";
import { app } from "@tauri-apps/api";

function App() {
  const [flatpakIsInstalled, setFlatpakIsInstalled] = createSignal(false);
  const [file, setFile] = createSignal(""); // path to a file, if we need it
  const [fileContent, setFileContent] = createSignal(""); // temporary storage for the contents of the file; is this even necessary?
  const [output, setOutput] = createSignal("");
  const [searchTerm, setSearchTerm] = createSignal("");
  const [searchResult, setSearchResult] = createSignal("");
  const [mode, setMode] = createSignal(1); // modes: 1 = main menu, 2 = software menu, 3 = help menu
  const [devlog, setDevlog] = createSignal(""); // for debugging
  const [theme, setTheme] = createSignal(1); // themes: 1 = standard light, 2 = standard dark. Don't know how to implement this yet.
  const [currentApp, setCurrentApp] = createSignal(""); // the app that the user is currently looking at

  async function initialize_flatpak() {
    const result = await invoke("initialize_flatpak");
    console.log("initialize_flatpak yielded ", result);
    return result;
  }
  async function check_flatpak() {
    const result = await invoke("check_flatpak");
    setFlatpakIsInstalled(result as boolean);
    console.log("check_flatpak yielded ", flatpakIsInstalled());
    return flatpakIsInstalled();
  }
  async function read_file() {
    setFileContent(await invoke("read_file", { file: fileContent() }));
    console.log("read_file yielded ", fileContent());
    return fileContent();
  }
  async function search_flatpak() {
    const result = await invoke("search_flatpak", { search: searchTerm() });
    setSearchResult(result as string);
    console.log("search_flatpak with search_term ", searchTerm(), "yielded ", searchResult());
    return searchResult();
  }
  async function get_info_flatpak() {
    const result = await invoke("get_info_flatpak", { app: searchResult() });
    console.log("get_info_flatpak with app ", searchResult(), "yielded ", result);
    return result;
  }
  async function list_installed_flatpak() {
    const result = await invoke("get_currently_installed_flatpak", { app: searchResult() });
    console.log("get_currently_installed_flatpak with app ", searchResult(), "yielded ", result);
    return result;
  }
  async function install_flatpak() {
    const result = await invoke("install_flatpak", { app: searchResult() });
    console.log("install_flatpak with app ", searchResult(), "yielded ", result);
    return result;
  }

  const htmlMenu = (
    // This is the main menu, where the user can browse or search for software
    <div class="container">
      <h1>Welcome to Tauri!</h1>

      <div class="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={logo} class="logo solid" alt="Solid logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and Solid logos to learn more.</p>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          search_flatpak();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{output()}</p>
      <p>{devlog()}</p>
    </div>
  );

  const softwareMenu = ( // This is where a given app will be displayed with all its info
    <div class="container">
      <p>{devlog()}</p>
    </div>
  );
  const htmlHelp = ( // This is for help and info
    <div class="container">
      <h1>Help</h1>
      <p>Howdy! I'm Gage, a computer science student at Texas A&M. This app gives users an easy, safe, and free way to install software by leveraging Flatpak's universal package manager. I'm using the Tauri framework to develop this app, which is a very fast, memory efficient way to make cross-platform desktop apps. I hope you enjoy using this app as much as I enjoyed making it!</p>
      <p>gagehowe@tamu.edu</p>
      <p>{devlog()}</p> 
    </div>
  );

  if (flatpakIsInstalled() == false) {
    return (
      <div class="container">
        <p>This app requires Flatpak to be installed. Would you like to install it now?</p>
        <button onClick={() => initialize_flatpak()}>Yes</button>
        <a href="https://flatpak.org/" target="_blank">Learn more about Flatpak</a>
      </div>
    );
  }

  check_flatpak();
  if (mode() == 1) {
    setDevlog("mode is " + mode());
    return (htmlMenu);
  }
  else if (mode() == 2) {
    setDevlog("mode is " + mode());
    return (softwareMenu);
  }
  else {
    setDevlog("mode is " + mode());
    return (htmlHelp);
  }
}

export default App;
