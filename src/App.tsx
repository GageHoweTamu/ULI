import { createSignal } from "solid-js";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import html from "solid-js/html";
import { app } from "@tauri-apps/api";

function App() {
  const [flatpakIsInstalled, setFlatpakIsInstalled] = createSignal(true);
  const [file, setFile] = createSignal(""); // path to a file, if we need it
  const [fileContent, setFileContent] = createSignal(""); // temporary storage for the contents of the file; is this even necessary?
  const [output, setOutput] = createSignal("");
  const [searchTerm, setSearchTerm] = createSignal("");
  const [searchResult, setSearchResult] = createSignal("");
  const [installedApps, setInstalledApps] = createSignal(""); // list of installed apps
  const [mode, setMode] = createSignal(1); // modes: 1 = main menu, 2 = software menu, 3 = help menu
  const [devlog, setDevlog] = createSignal(""); // for debugging
  const [theme, setTheme] = createSignal(1); // themes: 1 = standard light, 2 = standard dark. Don't know how to implement this yet.
  const [currentApp, setCurrentApp] = createSignal(""); // the app that the user is currently looking at
  const [popupIsOpen, setPopupIsOpen] = createSignal(false);
  const togglePopup = () => {
    setPopupIsOpen(!popupIsOpen());
  }
  const [appContent, setAppContent] = createSignal(""); // the content of the app that the user is currently looking at

function renderMode() {
  if (mode() === 1) {
    return mainMenu;
  } else if (mode() === 2) {
    (async () => {
      const installedApps = await list_installed_flatpak();
      setInstalledApps(installedApps as string); {/* verify this works */}
    })();
    return localMenu;
  } else if (mode() === 3) {
    return helpMenu;
  }
}
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
    const result = await invoke("get_info_flatpak", { app: currentApp() });
    console.log("get_info_flatpak with app ", currentApp(), "yielded ", result);
    return result;
  }
  async function list_installed_flatpak() {
    const result = await invoke("get_currently_installed_flatpak", {});
    console.log("list_installed_flatpak yielded ", result);
    return result;
  }
  async function install_flatpak() {
    const result = await invoke("install_flatpak", { app: currentApp() });
    console.log("install_flatpak with app ", currentApp(), "yielded ", result);
    return result;
  }
  async function uninstall_flatpak() {
    const result = await invoke("uninstall_flatpak", { app: currentApp() });
    console.log("uninstall_flatpak with app ", currentApp(), "yielded ", result);
    return result;
  }
  const Switcher = (
    <div>
      <button onClick={() => setMode(1)}>Main Menu</button>
      <button onClick={() => setMode(2)}>Local Menu</button>
      <button onClick={() => setMode(3)}>Help Menu</button>
    </div>
  );
  const mainMenu = ( // This is the main menu, where the user can browse or search for software
    <div class="container">
        {Switcher} {/* mode switcher with buttons for main menu, local menu, etc*/}

      <h1>tauri app</h1>
      <form /* Search bar; Add clear button to set searchTerm to an empty string. if searchTerm is empty, just display some flatpak apps */
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          search_flatpak();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>
      /* Results (this can be search results or generic app suggestions, depending on if searchTerm is empty) */


      <p>{output()}</p>
      <p>{devlog()}</p>
    </div>
  );

  const localMenu = ( // installed apps
    <div class="container">
      <h1>Installed Apps</h1>
      <p>{installedApps()}</p>
      <p>{devlog()}</p>
    </div>
  );

  const helpMenu = ( // This is for help and info
    <div class="container">
      <h1>Help</h1>
      <p>Howdy! I'm Gage, a computer science student at Texas A&M. This app gives users an easy, safe, and free way to install software by leveraging Flatpak's universal package manager. I'm using the Tauri framework to develop this app, which is a very fast, memory efficient way to make cross-platform desktop apps. I hope you enjoy using this app as much as I enjoyed making it!</p>
      <p>gagehowe@tamu.edu</p>

      <p>{devlog()}</p> 
    </div>
  );


{/*
  check_flatpak();
  if (flatpakIsInstalled() == false) {
    return (
      <div class="container">
        <p>This app requires Flatpak to be installed. Would you like to install it now?</p>
        <button onClick={() => initialize_flatpak()}>Yes</button>
        <a href="https://flatpak.org/" target="_blank">Learn more about Flatpak</a>

        <button onClick={popupIsOpen() ? togglePopup : togglePopup}>Open Popup</button>

        {popupIsOpen() && (
          <div class="modal">
            <div class="modal-content">
              <h2>Title: the name of the software</h2>
              <p>text: data about the software</p>
              <button onClick={togglePopup}>Close</button>
              <button onClick={togglePopup}>Install</button>
            </div>
          </div>
        )}
      </div>
    );
  }
*/}

  if (mode() == 1) {
    setDevlog("mode is " + mode());
    return (mainMenu);
  }
else if (mode() == 2) {
  setDevlog("mode is " + mode());
  (async () => {
    const installedApps = await list_installed_flatpak();
    setInstalledApps(installedApps as string); {/* verify this works */}
  })();
  return (localMenu);
}
  else {
    setDevlog("mode is " + mode());
    return (helpMenu);
  }
}

export default App;