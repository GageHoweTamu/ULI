import { createSignal } from "solid-js";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import html from "solid-js/html";
import { app } from "@tauri-apps/api";

function App() {
  const [fileContent, setFileContent] = createSignal(""); // temporary storage for the contents of the file; is this even necessary?
  const [output, setOutput] = createSignal("");
  const [searchTerm, setSearchTerm] = createSignal("");
  const [searchResult, setSearchResult] = createSignal("");
  const [mode, setMode] = createSignal(1); // modes: 1 = main menu, 2 = software menu, 3 = help menu

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
    </div>
  );

  const softwareMenu = ( // This is where a given app will be displayed with all its info
    <div class="container">
      
    </div>
  );
  const htmlHelp = ( // This is for help and info
    <div class="container">
      // This is where a given app will be displayed with all its info
    </div>
  );

  if (mode() == 1) {
    return (htmlMenu);
  }
  else if (mode() == 2) {
    return (softwareMenu);
  }
  else {
    return (htmlHelp);
  }
}

export default App;
